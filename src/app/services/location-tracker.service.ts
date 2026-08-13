import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  collection, 
  doc, 
  setDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase.config';

export interface LocationPoint {
  id?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
  profile?: string;
}

export type UserProfile = 'Boy' | 'Girl' | null;

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {
  private readonly STORAGE_KEY = 'location-tracker-points';
  private readonly PROFILE_KEY = 'location-tracker-profile';
  // Using the 'adventures' collection because it's already whitelisted in Firestore rules!
  private readonly COLLECTION_NAME = 'adventures'; 
  
  private locationPoints: LocationPoint[] = [];
  private locationPointsSubject = new BehaviorSubject<LocationPoint[]>(this.locationPoints);
  public locationPoints$: Observable<LocationPoint[]> = this.locationPointsSubject.asObservable();
  
  private currentLocationSubject = new BehaviorSubject<LocationPoint | null>(null);
  public currentLocation$: Observable<LocationPoint | null> = this.currentLocationSubject.asObservable();

  private partnerLocationSubject = new BehaviorSubject<LocationPoint | null>(null);
  public partnerLocation$: Observable<LocationPoint | null> = this.partnerLocationSubject.asObservable();
  
  private isTrackingSubject = new BehaviorSubject<boolean>(false);
  public isTracking$: Observable<boolean> = this.isTrackingSubject.asObservable();
  
  private trackingStatusSubject = new BehaviorSubject<{ message: string; error?: string }>({ 
    message: 'Ready to track' 
  });
  public trackingStatus$: Observable<{ message: string; error?: string }> = this.trackingStatusSubject.asObservable();
  
  private useFirestore = false;
  private unsubscribeSnapshot: (() => void) | null = null;

  public currentUserProfile: UserProfile = null;

  constructor() {
    this.loadProfile();
    this.checkFirebaseConfig();
    this.loadTrackingHistory();
  }

  private loadProfile(): void {
    const storedProfile = localStorage.getItem(this.PROFILE_KEY);
    if (storedProfile === 'Boy' || storedProfile === 'Girl') {
      this.currentUserProfile = storedProfile as UserProfile;
    }
  }

  public setProfile(profile: UserProfile): void {
    this.currentUserProfile = profile;
    if (profile) {
      localStorage.setItem(this.PROFILE_KEY, profile);
      // Re-setup listener if firestore is active
      if (this.useFirestore) {
        this.setupFirestoreListener();
      }
    } else {
      localStorage.removeItem(this.PROFILE_KEY);
    }
  }

  private checkFirebaseConfig(): void {
    try {
      if (isFirebaseConfigured() && db) {
        this.useFirestore = true;
        this.setupFirestoreListener();
      } else {
        this.loadFromStorage();
      }
    } catch (error) {
      console.warn('Firebase not configured, using localStorage:', error);
      this.loadFromStorage();
    }
  }

  private setupFirestoreListener(): void {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      // Clean up previous listener
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
      }

      const locationsRef = collection(db, this.COLLECTION_NAME);
      const q = query(locationsRef);

      this.unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach(docSnap => {
          if (!docSnap.id.startsWith('location_')) return; // Ignore actual adventures
          
          const profileId = docSnap.id.replace('location_', '');
          const data = docSnap.data();
          
          const point: LocationPoint = {
            id: docSnap.id,
            latitude: data['latitude'],
            longitude: data['longitude'],
            accuracy: data['accuracy'],
            timestamp: data['timestamp']?.toDate ? data['timestamp'].toDate() : new Date(data['timestamp']),
            speed: data['speed'],
            heading: data['heading'],
            profile: profileId
          };

          if (this.currentUserProfile) {
             if (profileId !== this.currentUserProfile) {
               this.partnerLocationSubject.next(point);
             } else {
               // Update own location from Firestore (in case of multiple devices, though unlikely)
               this.currentLocationSubject.next(point);
             }
          }
        });
      });
    } catch (error) {
      console.error('Firestore setup error:', error);
      this.loadFromStorage();
    }
  }

  refreshLocation(): void {
    if (!navigator.geolocation) {
      this.trackingStatusSubject.next({ 
        message: 'Geolocation not supported', 
        error: 'Your browser does not support geolocation' 
      });
      return;
    }

    if (!this.currentUserProfile) {
       this.trackingStatusSubject.next({ 
        message: 'Profile not selected', 
        error: 'Please click Boy or Girl first to set up this device.' 
      });
      return;
    }

    this.isTrackingSubject.next(true);
    this.trackingStatusSubject.next({ message: 'Fetching location...' });

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => this.handlePosition(position),
      (error) => this.handleError(error),
      options
    );
  }

  private handlePosition(position: GeolocationPosition): void {
    const { latitude, longitude, accuracy, speed, heading } = position.coords;
    
    const locationPoint: LocationPoint = {
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
      speed: speed || undefined,
      heading: heading || undefined,
      profile: this.currentUserProfile || undefined
    };

    this.currentLocationSubject.next(locationPoint);
    this.addLocationPoint(locationPoint);
    this.isTrackingSubject.next(false);
    this.trackingStatusSubject.next({ 
      message: `Updated: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${accuracy.toFixed(0)}m)` 
    });
  }

  private handleError(error: GeolocationPositionError): void {
    let errorMessage = 'Unknown error occurred';
    this.isTrackingSubject.next(false);
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permission denied. Enable location access in your browser settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Position unavailable. Check your GPS/network.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }

    this.trackingStatusSubject.next({ 
      message: 'Location error', 
      error: errorMessage 
    });
    console.error('Geolocation error:', error);
  }

  private async addLocationPoint(point: LocationPoint): Promise<void> {
    this.locationPoints.unshift(point);
    this.locationPointsSubject.next([...this.locationPoints]);
    this.saveToStorage();

    if (this.useFirestore && db && this.currentUserProfile) {
      try {
        const locationsRef = collection(db, this.COLLECTION_NAME);
        const userDocRef = doc(locationsRef, `location_${this.currentUserProfile}`);
        // Using setDoc to overwrite/create the single document for this user
        await setDoc(userDocRef, {
          latitude: point.latitude,
          longitude: point.longitude,
          accuracy: point.accuracy,
          timestamp: new Date(point.timestamp),
          speed: point.speed || null,
          heading: point.heading || null
        });
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }
  }

  private saveToStorage(): void {
    const points = this.locationPoints.map(p => ({
      ...p,
      timestamp: p.timestamp.toISOString()
    }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.locationPoints = JSON.parse(stored).map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      }));
      this.locationPointsSubject.next(this.locationPoints);
    }
  }

  private loadTrackingHistory(): void {
    this.loadFromStorage();
  }

  clearHistory(): void {
    this.locationPoints = [];
    this.locationPointsSubject.next([]);
    this.currentLocationSubject.next(null);
    this.saveToStorage();
    this.trackingStatusSubject.next({ message: 'History cleared' });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  collection, 
  doc, 
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
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
}

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {
  private readonly STORAGE_KEY = 'location-tracker-points';
  private readonly COLLECTION_NAME = 'locations';
  
  private locationPoints: LocationPoint[] = [];
  private locationPointsSubject = new BehaviorSubject<LocationPoint[]>(this.locationPoints);
  public locationPoints$: Observable<LocationPoint[]> = this.locationPointsSubject.asObservable();
  
  private currentLocationSubject = new BehaviorSubject<LocationPoint | null>(null);
  public currentLocation$: Observable<LocationPoint | null> = this.currentLocationSubject.asObservable();
  
  private isTrackingSubject = new BehaviorSubject<boolean>(false);
  public isTracking$: Observable<boolean> = this.isTrackingSubject.asObservable();
  
  private trackingStatusSubject = new BehaviorSubject<{ message: string; error?: string }>({ 
    message: 'Ready to track' 
  });
  public trackingStatus$: Observable<{ message: string; error?: string }> = this.trackingStatusSubject.asObservable();
  
  private watchId: number | null = null;
  private useFirestore = false;
  private unsubscribeSnapshot: (() => void) | null = null;

  constructor() {
    this.checkFirebaseConfig();
    this.loadTrackingHistory();
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
      
      const locationsRef = collection(db, this.COLLECTION_NAME);
      let q;
      try {
        q = query(locationsRef, orderBy('timestamp', 'desc'));
      } catch {
        q = query(locationsRef);
      }

      this.unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        this.locationPoints = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            latitude: data['latitude'],
            longitude: data['longitude'],
            accuracy: data['accuracy'],
            timestamp: data['timestamp']?.toDate ? data['timestamp'].toDate() : new Date(data['timestamp']),
            speed: data['speed'],
            heading: data['heading']
          } as LocationPoint;
        });
        this.locationPointsSubject.next(this.locationPoints);
      });
    } catch (error) {
      console.error('Firestore setup error:', error);
      this.loadFromStorage();
    }
  }

  startTracking(): void {
    if (!navigator.geolocation) {
      this.trackingStatusSubject.next({ 
        message: 'Geolocation not supported', 
        error: 'Your browser does not support geolocation' 
      });
      return;
    }

    if (this.isTrackingSubject.value) {
      return;
    }

    this.isTrackingSubject.next(true);
    this.trackingStatusSubject.next({ message: 'Starting location tracking...' });

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handlePosition(position),
      (error) => this.handleError(error),
      options
    );
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTrackingSubject.next(false);
    this.trackingStatusSubject.next({ message: 'Tracking stopped' });
  }

  private handlePosition(position: GeolocationPosition): void {
    const { latitude, longitude, accuracy, speed, heading } = position.coords;
    
    const locationPoint: LocationPoint = {
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
      speed: speed || undefined,
      heading: heading || undefined
    };

    this.currentLocationSubject.next(locationPoint);
    this.addLocationPoint(locationPoint);
    this.trackingStatusSubject.next({ 
      message: `Tracking: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${accuracy.toFixed(0)}m)` 
    });
  }

  private handleError(error: GeolocationPositionError): void {
    let errorMessage = 'Unknown error occurred';
    
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
      message: 'Tracking error', 
      error: errorMessage 
    });
    console.error('Geolocation error:', error);
  }

  private async addLocationPoint(point: LocationPoint): Promise<void> {
    this.locationPoints.unshift(point);
    this.locationPointsSubject.next([...this.locationPoints]);
    this.saveToStorage();

    if (this.useFirestore && db) {
      try {
        const locationsRef = collection(db, this.COLLECTION_NAME);
        const newDocRef = doc(locationsRef);
        await setDoc(newDocRef, {
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
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }
}
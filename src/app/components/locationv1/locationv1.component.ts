import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationTrackerService, LocationPoint, UserProfile } from '../../services/location-tracker.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let L: any; // Leaflet library

@Component({
  selector: 'app-locationv1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locationv1.component.html',
  styleUrls: ['./locationv1.component.css']
})
export class Locationv1Component implements OnInit, OnDestroy {
  isTracking$: Observable<boolean>;
  currentLocation$: Observable<LocationPoint | null>;
  partnerLocation$: Observable<LocationPoint | null>;
  trackingStatus$: Observable<{ message: string; error?: string }>;

  currentLocation: LocationPoint | null = null;
  partnerLocation: LocationPoint | null = null;
  isTracking: boolean = false;
  
  map: any;
  boyMarker: any;
  girlMarker: any;
  
  distanceApart: number | null = null;

  get currentUserProfile(): UserProfile {
    return this.locationTrackerService.currentUserProfile;
  }

  private destroy$ = new Subject<void>();

  constructor(private locationTrackerService: LocationTrackerService) {
    this.isTracking$ = this.locationTrackerService.isTracking$;
    this.currentLocation$ = this.locationTrackerService.currentLocation$;
    this.partnerLocation$ = this.locationTrackerService.partnerLocation$;
    this.trackingStatus$ = this.locationTrackerService.trackingStatus$;
  }

  ngOnInit(): void {
    this.initializeMap();
    
    this.currentLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        this.currentLocation = location;
        if (location) {
          this.updateMapMarker(location, this.currentUserProfile!);
          this.updateDistance();
          this.fitMapBounds();
        }
      });

    this.partnerLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        this.partnerLocation = location;
        if (location) {
          const partnerProfile = this.currentUserProfile === 'Boy' ? 'Girl' : 'Boy';
          this.updateMapMarker(location, partnerProfile);
          this.updateDistance();
          this.fitMapBounds();
        }
      });

    this.isTracking$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tracking => {
        this.isTracking = tracking;
      });
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    this.map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private updateMapMarker(location: LocationPoint, profile: 'Boy' | 'Girl'): void {
    if (!this.map) return;

    const latLng = [location.latitude, location.longitude];
    const isBoy = profile === 'Boy';
    const color = isBoy ? '#4facfe' : '#ff0844';

    if (isBoy) {
      if (this.boyMarker) {
        this.boyMarker.setLatLng(latLng);
      } else {
        this.boyMarker = L.circleMarker(latLng, {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map)
          .bindPopup(`<strong>Boy</strong><br>Updated: ${location.timestamp.toLocaleTimeString()}`);
      }
    } else {
      if (this.girlMarker) {
        this.girlMarker.setLatLng(latLng);
      } else {
        this.girlMarker = L.circleMarker(latLng, {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map)
          .bindPopup(`<strong>Girl</strong><br>Updated: ${location.timestamp.toLocaleTimeString()}`);
      }
    }
  }

  private fitMapBounds(): void {
    if (!this.map) return;
    
    const latLngs = [];

    if (this.boyMarker) {
      latLngs.push(this.boyMarker.getLatLng());
    }
    if (this.girlMarker) {
      latLngs.push(this.girlMarker.getLatLng());
    }

    if (latLngs.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (latLngs.length === 1) {
      this.map.setView(latLngs[0], 16);
    }
  }

  setupProfile(profile: 'Boy' | 'Girl'): void {
    this.locationTrackerService.setProfile(profile);
    alert(`Device configured for ${profile}. Location permission is saved.`);
  }

  startLiveTracking(): void {
    if (!this.currentUserProfile) {
      alert(`Please select Boy or Girl icon to set up this device first.`);
      return;
    }
    this.locationTrackerService.startRealTimeTracking();
  }

  stopLiveTracking(): void {
    this.locationTrackerService.stopRealTimeTracking();
  }

  private updateDistance(): void {
    if (this.currentLocation && this.partnerLocation) {
      this.distanceApart = this.getDistance(
        this.currentLocation.latitude, 
        this.currentLocation.longitude, 
        this.partnerLocation.latitude, 
        this.partnerLocation.longitude
      );
    } else {
      this.distanceApart = null;
    }
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  ngOnDestroy(): void {
    this.locationTrackerService.stopRealTimeTracking(); // Ensure we stop tracking if component unmounts
    this.destroy$.next();
    this.destroy$.complete();
  }
}

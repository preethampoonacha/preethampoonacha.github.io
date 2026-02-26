import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationTrackerService, LocationPoint } from '../../services/location-tracker.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let L: any; // Leaflet library

@Component({
  selector: 'app-location-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-tracker.component.html',
  styleUrls: ['./location-tracker.component.css']
})
export class LocationTrackerComponent implements OnInit, OnDestroy {
  isTracking$: Observable<boolean>;
  locationPoints$: Observable<LocationPoint[]>;
  currentLocation$: Observable<LocationPoint | null>;
  trackingStatus$: Observable<{ message: string; error?: string }>;

  locationPoints: LocationPoint[] = [];
  currentLocation: LocationPoint | null = null;
  isTracking: boolean = false;
  
  map: any;
  marker: any;
  polyline: any;
  markers: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private locationTrackerService: LocationTrackerService) {
    this.isTracking$ = this.locationTrackerService.isTracking$;
    this.locationPoints$ = this.locationTrackerService.locationPoints$;
    this.currentLocation$ = this.locationTrackerService.currentLocation$;
    this.trackingStatus$ = this.locationTrackerService.trackingStatus$;
  }

  ngOnInit(): void {
    this.initializeMap();
    
    this.locationPoints$
      .pipe(takeUntil(this.destroy$))
      .subscribe(points => {
        this.locationPoints = points;
        this.updateMapPolyline();
      });

    this.currentLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        this.currentLocation = location;
        if (location) {
          this.updateMapMarker(location);
        }
      });

    this.isTracking$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tracking => {
        this.isTracking = tracking;
      });
  }

  private initializeMap(): void {
    // Initialize Leaflet map centered on default coordinates
    this.map = L.map('map').setView([20, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Initialize polyline for tracking path
    this.polyline = L.polyline([], {
      color: '#667eea',
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(this.map);
  }

  private updateMapMarker(location: LocationPoint): void {
    const latLng = [location.latitude, location.longitude];

    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.circleMarker(latLng, {
        radius: 8,
        fillColor: '#667eea',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(this.map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>Current Location</strong><br>
            Lat: ${location.latitude.toFixed(6)}<br>
            Lon: ${location.longitude.toFixed(6)}<br>
            Accuracy: ±${location.accuracy.toFixed(0)}m
          </div>
        `);
    }

    this.map.setView(latLng, this.map.getZoom());
  }

  private updateMapPolyline(): void {
    if (this.locationPoints.length > 0) {
      const latLngs = this.locationPoints.map(p => [p.latitude, p.longitude]);
      this.polyline.setLatLngs(latLngs);

      // Update or create point markers
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      this.locationPoints.forEach((point, index) => {
        const marker = L.circleMarker([point.latitude, point.longitude], {
          radius: 4,
          fillColor: '#764ba2',
          color: '#fff',
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.6
        }).addTo(this.map)
          .bindPopup(`
            <div style="font-size: 12px;">
              Point ${this.locationPoints.length - index}<br>
              Time: ${point.timestamp.toLocaleTimeString()}<br>
              Accuracy: ±${point.accuracy.toFixed(0)}m
            </div>
          `);
        this.markers.push(marker);
      });

      // Fit map to bounds
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs as any);
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  startTracking(): void {
    this.locationTrackerService.startTracking();
  }

  stopTracking(): void {
    this.locationTrackerService.stopTracking();
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear tracking history?')) {
      this.locationTrackerService.clearHistory();
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];
      this.polyline.setLatLngs([]);
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    }
  }

  exportData(): void {
    const data = {
      locations: this.locationPoints.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        accuracy: p.accuracy,
        timestamp: p.timestamp.toISOString(),
        speed: p.speed,
        heading: p.heading
      })),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-tracking-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  calculateTotalDistance(): number {
    if (this.locationPoints.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < this.locationPoints.length - 1; i++) {
      const p1 = this.locationPoints[i];
      const p2 = this.locationPoints[i + 1];
      totalDistance += this.getDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    }
    return totalDistance;
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
    this.destroy$.next();
    this.destroy$.complete();
    this.locationTrackerService.stopTracking();
  }
}
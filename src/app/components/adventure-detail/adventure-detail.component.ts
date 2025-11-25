import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure } from '../../models/task.model';

@Component({
  selector: 'app-adventure-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container" *ngIf="adventure">
      <div class="detail-header">
        <a routerLink="/adventures" class="back-link">← Back to Adventures</a>
        <div class="header-actions">
          <a [routerLink]="['/adventures', adventure.id, 'edit']" class="btn btn-secondary">Edit</a>
          <button (click)="deleteAdventure()" class="btn btn-danger">Delete</button>
        </div>
      </div>

      <div class="adventure-detail-card">
        <div class="detail-title-section">
          <h1>{{ adventure.title }}</h1>
          <div class="title-badges">
            <span class="status-badge status-{{ adventure.status }}">{{ getStatusLabel(adventure.status) }}</span>
            <span class="partner-badge" [class.partner1]="adventure.assignedTo === 'partner1'"
                  [class.partner2]="adventure.assignedTo === 'partner2'"
                  [class.both]="adventure.assignedTo === 'both'">
              {{ getPartnerLabel(adventure.assignedTo) }}
            </span>
            <span *ngIf="adventure.isSurprise && adventure.revealed" class="surprise-badge">🎁 Surprise</span>
          </div>
        </div>

        <div class="photo-gallery" *ngIf="adventure.photos && adventure.photos.length > 0">
          <div class="main-photo">
            <img [src]="mainPhoto || adventure.photos[0]" [alt]="adventure.title" />
          </div>
          <div class="photo-thumbnails" *ngIf="adventure.photos.length > 1">
            <div *ngFor="let photo of adventure.photos" class="thumbnail" 
                 [class.active]="(mainPhoto || adventure.photos[0]) === photo"
                 (click)="setMainPhoto(photo)">
              <img [src]="photo" [alt]="adventure.title" />
            </div>
          </div>
        </div>

        <div class="detail-content">
          <div class="detail-section">
            <h3>About This Adventure</h3>
            <p *ngIf="adventure.description" class="description">{{ adventure.description }}</p>
            <p *ngIf="!adventure.description" class="no-content">No description provided</p>
          </div>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-icon">{{ getCategoryIcon(adventure.category) }}</span>
              <div>
                <div class="detail-label">Category</div>
                <div class="detail-value">{{ getCategoryLabel(adventure.category) }}</div>
              </div>
            </div>

            <div class="detail-item" *ngIf="adventure.location">
              <span class="detail-icon">📍</span>
              <div>
                <div class="detail-label">Location</div>
                <div class="detail-value">{{ adventure.location }}</div>
              </div>
            </div>

            <div class="detail-item" *ngIf="adventure.targetDate">
              <span class="detail-icon">📅</span>
              <div>
                <div class="detail-label">Target Date</div>
                <div class="detail-value">{{ adventure.targetDate | date:'fullDate' }}</div>
              </div>
            </div>

            <div class="detail-item" *ngIf="adventure.completedDate">
              <span class="detail-icon">✅</span>
              <div>
                <div class="detail-label">Completed</div>
                <div class="detail-value">{{ adventure.completedDate | date:'fullDate' }}</div>
              </div>
            </div>

            <div class="detail-item" *ngIf="adventure.estimatedCost">
              <span class="detail-icon">💰</span>
              <div>
                <div class="detail-label">Estimated Cost</div>
                <div class="detail-value">{{ '$' + adventure.estimatedCost }}</div>
              </div>
            </div>

            <div class="detail-item" *ngIf="adventure.rating">
              <span class="detail-icon">⭐</span>
              <div>
                <div class="detail-label">Rating</div>
                <div class="detail-value">
                  <span class="rating-stars">{{ getRatingStars(adventure.rating) }}</span>
                  {{ adventure.rating }}/5
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section" *ngIf="adventure.review">
            <h3>Our Review</h3>
            <p class="review-text">{{ adventure.review }}</p>
          </div>

          <div class="detail-section" *ngIf="adventure.notes">
            <h3>Notes</h3>
            <p class="notes-text">{{ adventure.notes }}</p>
          </div>

          <div class="detail-section">
            <h3>Timeline</h3>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-label">Created</div>
                  <div class="timeline-date">{{ adventure.createdAt | date:'fullDate' }}</div>
                </div>
              </div>
              <div class="timeline-item" *ngIf="adventure.updatedAt.getTime() !== adventure.createdAt.getTime()">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-label">Last Updated</div>
                  <div class="timeline-date">{{ adventure.updatedAt | date:'fullDate' }}</div>
                </div>
              </div>
              <div class="timeline-item" *ngIf="adventure.completedDate">
                <div class="timeline-dot completed"></div>
                <div class="timeline-content">
                  <div class="timeline-label">Completed</div>
                  <div class="timeline-date">{{ adventure.completedDate | date:'fullDate' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="not-found" *ngIf="!adventure">
      <h2>Adventure not found</h2>
      <a routerLink="/adventures" class="btn btn-primary">Back to Adventures</a>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .back-link {
      color: #f5576c;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .adventure-detail-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .detail-title-section {
      margin-bottom: 30px;
    }

    .detail-title-section h1 {
      margin: 0 0 15px 0;
      font-size: 2rem;
      color: #1f2937;
    }

    .title-badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }

    .status-wishlist {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-planned {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-in-progress {
      background: #fef3c7;
      color: #92400e;
    }

    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }

    .partner-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      background: #e5e7eb;
      color: #6b7280;
    }

    .partner-badge.partner1 {
      background: #dbeafe;
      color: #1e40af;
    }

    .partner-badge.partner2 {
      background: #fce7f3;
      color: #9f1239;
    }

    .partner-badge.both {
      background: linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%);
      color: #7c2d12;
    }

    .surprise-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      background: #fbbf24;
      color: #78350f;
    }

    .photo-gallery {
      margin-bottom: 30px;
    }

    .main-photo {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 12px;
      overflow: hidden;
      background: #f3f4f6;
      margin-bottom: 15px;
    }

    .main-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-thumbnails {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }

    .thumbnail {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .thumbnail:hover {
      border-color: #f5576c;
      transform: scale(1.05);
    }

    .thumbnail.active {
      border-color: #f5576c;
      box-shadow: 0 0 0 2px rgba(245, 87, 108, 0.3);
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .detail-section h3 {
      margin: 0 0 15px 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .description, .review-text, .notes-text {
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
    }

    .no-content {
      color: #9ca3af;
      font-style: italic;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .detail-icon {
      font-size: 24px;
      line-height: 1;
    }

    .detail-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .rating-stars {
      color: #fbbf24;
      margin-right: 8px;
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }

    .timeline-dot {
      position: absolute;
      left: -22px;
      top: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #e5e7eb;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #e5e7eb;
    }

    .timeline-dot.completed {
      background: #10b981;
      box-shadow: 0 0 0 2px #10b981;
    }

    .timeline-label {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .timeline-date {
      font-size: 14px;
      color: #6b7280;
    }

    .not-found {
      text-align: center;
      padding: 60px 20px;
    }

    .not-found h2 {
      margin-bottom: 20px;
      color: #1f2937;
    }

    @media (max-width: 768px) {
      .adventure-detail-card {
        padding: 20px;
      }

      .detail-title-section h1 {
        font-size: 1.5rem;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdventureDetailComponent implements OnInit {
  adventure: Adventure | undefined;
  mainPhoto: string | null = null;

  categories = [
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'activity', label: 'Activity', icon: '🎯' },
    { value: 'milestone', label: 'Milestone', icon: '🎉' },
    { value: 'date-night', label: 'Date Night', icon: '💕' },
    { value: 'home', label: 'Home', icon: '🏠' }
  ];

  constructor(
    private adventureService: AdventureService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAdventure(+id);
    }
  }

  loadAdventure(id: number): void {
    this.adventure = this.adventureService.getAdventureById(id);
    if (this.adventure && this.adventure.photos.length > 0) {
      this.mainPhoto = this.adventure.photos[0];
    } else {
      this.mainPhoto = null;
    }
  }

  setMainPhoto(photo: string): void {
    this.mainPhoto = photo;
    if (this.adventure) {
      const index = this.adventure.photos.indexOf(photo);
      if (index > 0) {
        // Move to front
        this.adventure.photos.splice(index, 1);
        this.adventure.photos.unshift(photo);
      }
    }
  }

  getStatusLabel(status: Adventure['status']): string {
    const labels: Record<Adventure['status'], string> = {
      'wishlist': '💭 Wishlist',
      'planned': '📅 Planned',
      'in-progress': '🚀 In Progress',
      'completed': '✅ Completed'
    };
    return labels[status];
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || category;
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || '✨';
  }

  getPartnerLabel(partner: string): string {
    const labels: Record<string, string> = {
      'partner1': '👤 Partner 1',
      'partner2': '👤 Partner 2',
      'both': '💑 Both'
    };
    return labels[partner] || partner;
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(rating);
  }

  async deleteAdventure(): Promise<void> {
    if (this.adventure && confirm('Are you sure you want to delete this adventure?')) {
      await this.adventureService.deleteAdventure(this.adventure.id);
      this.router.navigate(['/adventures']);
    }
  }
}

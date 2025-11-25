import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure } from '../../models/task.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="timeline-container">
      <div class="timeline-header">
        <h1>📖 Our Adventure Timeline</h1>
        <p class="subtitle">A beautiful journey through all your completed adventures</p>
      </div>

      <div *ngIf="completedAdventures.length === 0" class="empty-state">
        <div class="empty-icon">💭</div>
        <h2>No completed adventures yet</h2>
        <p>Complete your first adventure to see it here!</p>
        <a routerLink="/adventures" class="btn btn-primary">View Adventures</a>
      </div>

      <div class="timeline-wrapper" *ngIf="completedAdventures.length > 0">
        <div class="timeline-line"></div>
        <div class="timeline-items">
          <div *ngFor="let adventure of completedAdventures; let i = index" class="timeline-entry" [attr.data-year]="getYear(adventure)">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line" *ngIf="i < completedAdventures.length - 1"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-date">
                {{ adventure.completedDate | date:'fullDate' }}
              </div>
              <div class="timeline-card" [routerLink]="['/adventures', adventure.id]">
                <div class="card-photo" *ngIf="adventure.photos && adventure.photos.length > 0">
                  <img [src]="adventure.photos[0]" [alt]="adventure.title" />
                </div>
                <div class="card-content">
                  <div class="card-header">
                    <h3>{{ adventure.title }}</h3>
                    <div class="card-badges">
                      <span class="category-badge">{{ getCategoryIcon(adventure.category) }}</span>
                      <span class="rating-badge" *ngIf="adventure.rating">
                        ⭐ {{ adventure.rating }}/5
                      </span>
                    </div>
                  </div>
                  <p class="card-description" *ngIf="adventure.description">{{ adventure.description }}</p>
                  <div class="card-meta">
                    <span *ngIf="adventure.location">📍 {{ adventure.location }}</span>
                    <span *ngIf="adventure.review" class="has-review">💬 Has review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .timeline-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .timeline-header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1.1rem;
      margin: 0;
    }

    .timeline-wrapper {
      position: relative;
      padding: 20px 0;
    }

    .timeline-line {
      position: absolute;
      left: 30px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
      border-radius: 2px;
    }

    .timeline-items {
      position: relative;
    }

    .timeline-entry {
      position: relative;
      margin-bottom: 40px;
      padding-left: 80px;
    }

    .timeline-marker {
      position: absolute;
      left: 0;
      top: 0;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .marker-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: 4px solid white;
      box-shadow: 0 0 0 3px #f5576c;
      z-index: 2;
    }

    .marker-line {
      width: 3px;
      flex: 1;
      background: linear-gradient(180deg, #f5576c 0%, #f093fb 100%);
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .timeline-content {
      position: relative;
    }

    .timeline-date {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 15px;
      font-weight: 500;
    }

    .timeline-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      border: 2px solid transparent;
    }

    .timeline-card:hover {
      transform: translateX(10px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: #f5576c;
    }

    .card-photo {
      width: 200px;
      min-width: 200px;
      aspect-ratio: 1;
      background: #f3f4f6;
      overflow: hidden;
    }

    .card-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-content {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 15px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1f2937;
      flex: 1;
    }

    .card-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .category-badge {
      padding: 6px 12px;
      border-radius: 12px;
      background: #f3f4f6;
      font-size: 18px;
    }

    .rating-badge {
      padding: 6px 12px;
      border-radius: 12px;
      background: #fef3c7;
      color: #92400e;
      font-size: 14px;
      font-weight: 600;
    }

    .card-description {
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 15px 0;
      flex: 1;
    }

    .card-meta {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #9ca3af;
    }

    .has-review {
      color: #f5576c;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      margin: 0 0 10px 0;
      color: #1f2937;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .timeline-entry {
        padding-left: 60px;
      }

      .timeline-line {
        left: 20px;
      }

      .timeline-marker {
        width: 40px;
      }

      .marker-dot {
        width: 16px;
        height: 16px;
      }

      .timeline-card {
        flex-direction: column;
      }

      .card-photo {
        width: 100%;
        aspect-ratio: 16/9;
      }

      .card-header {
        flex-direction: column;
      }
    }
  `]
})
export class TimelineComponent implements OnInit {
  completedAdventures: Adventure[] = [];

  categories = [
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'activity', label: 'Activity', icon: '🎯' },
    { value: 'milestone', label: 'Milestone', icon: '🎉' },
    { value: 'date-night', label: 'Date Night', icon: '💕' },
    { value: 'home', label: 'Home', icon: '🏠' }
  ];

  constructor(private adventureService: AdventureService) {}

  ngOnInit(): void {
    this.loadCompletedAdventures();
    this.adventureService.adventures$.subscribe(() => {
      this.loadCompletedAdventures();
    });
  }

  loadCompletedAdventures(): void {
    this.completedAdventures = this.adventureService.getCompletedAdventures();
  }

  getYear(adventure: Adventure): string {
    if (adventure.completedDate) {
      return adventure.completedDate.getFullYear().toString();
    }
    return '';
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || '✨';
  }
}

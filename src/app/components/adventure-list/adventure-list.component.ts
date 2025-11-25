import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure, AdventureCategory, Partner } from '../../models/task.model';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-adventure-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  template: `
    <app-loader *ngIf="isLoading"></app-loader>
    <div class="adventure-container">
      <div class="header-section">
        <div class="header-content">
          <h1>💑 Our Adventures</h1>
          <div class="header-actions">
            <div class="sync-status" [class.connected]="firebaseStatus.connected" [class.disconnected]="!firebaseStatus.connected">
              <span class="status-dot"></span>
              <span class="status-text">{{ firebaseStatus.message }}</span>
            </div>
            <a routerLink="/adventures/new" class="btn btn-primary">+ New Adventure</a>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-buttons">
            <button
              class="filter-btn"
              [class.active]="selectedStatus === null"
              (click)="filterByStatus(null)"
            >
              All
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedStatus === 'wishlist'"
              (click)="filterByStatus('wishlist')"
            >
              💭 Wishlist
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedStatus === 'planned'"
              (click)="filterByStatus('planned')"
            >
              📅 Planned
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedStatus === 'in-progress'"
              (click)="filterByStatus('in-progress')"
            >
              🚀 In Progress
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedStatus === 'completed'"
              (click)="filterByStatus('completed')"
            >
              ✅ Completed
            </button>
          </div>

          <div class="filter-buttons">
            <button
              class="filter-btn"
              [class.active]="selectedCreatedBy === null"
              (click)="filterByCreatedBy(null)"
            >
              All Creators
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCreatedBy === 'partner1'"
              (click)="filterByCreatedBy('partner1')"
            >
              👨 Doree
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCreatedBy === 'partner2'"
              (click)="filterByCreatedBy('partner2')"
            >
              👩 Nobuu
            </button>
            <button
              class="filter-btn"
              [class.active]="selectedCreatedBy === 'both'"
              (click)="filterByCreatedBy('both')"
            >
              💑 Both
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredAdventures.length === 0" class="empty-state">
        <div class="empty-icon">💭</div>
        <h2>No adventures yet</h2>
        <p>Start your journey together by creating your first adventure!</p>
        <a routerLink="/adventures/new" class="btn btn-primary">Create Adventure</a>
      </div>

      <div class="adventures-grid">
        <div *ngFor="let adventure of filteredAdventures" class="adventure-card" [class.surprise]="adventure.isSurprise && !adventure.revealed">
          <div class="card-header">
            <div class="card-title-section">
              <h3 class="adventure-title">{{ adventure.title }}</h3>
              <div class="partner-badges">
                <span class="partner-badge" [class.partner1]="adventure.assignedTo === 'partner1'"
                      [class.partner2]="adventure.assignedTo === 'partner2'"
                      [class.both]="adventure.assignedTo === 'both'">
                  📌 {{ getPartnerLabel(adventure.assignedTo) }}
                </span>
                <span class="partner-badge created-by" 
                      [class.partner1]="adventure.createdBy === 'partner1'"
                      [class.partner2]="adventure.createdBy === 'partner2'"
                      [class.both]="adventure.createdBy === 'both'">
                  ✨ {{ getPartnerLabel(adventure.createdBy) }}
                </span>
                <span *ngIf="adventure.isSurprise && adventure.revealed" class="surprise-badge">🎁 Surprise</span>
              </div>
            </div>
            <span class="status-badge status-{{ adventure.status }}">{{ getStatusLabel(adventure.status) }}</span>
          </div>

          <div *ngIf="adventure.photos && adventure.photos.length > 0" class="photo-thumbnail">
            <img [src]="adventure.photos[0]" [alt]="adventure.title" />
            <span *ngIf="adventure.photos.length > 1" class="photo-count">+{{ adventure.photos.length - 1 }}</span>
          </div>

          <p class="adventure-description" *ngIf="adventure.description">{{ adventure.description }}</p>

          <div class="adventure-meta">
            <div class="meta-item">
              <span class="meta-icon">{{ getCategoryIcon(adventure.category) }}</span>
              <span>{{ getCategoryLabel(adventure.category) }}</span>
            </div>
            <div class="meta-item" *ngIf="adventure.location">
              <span class="meta-icon">📍</span>
              <span>{{ adventure.location }}</span>
            </div>
            <div class="meta-item" *ngIf="adventure.targetDate">
              <span class="meta-icon">📅</span>
              <span>{{ adventure.targetDate | date:'shortDate' }}</span>
            </div>
            <div class="meta-item" *ngIf="adventure.rating">
              <span class="meta-icon">⭐</span>
              <span>{{ adventure.rating }}/5</span>
            </div>
          </div>

          <div class="card-actions">
            <a [routerLink]="['/adventures', adventure.id]" class="btn btn-secondary">View</a>
            <a [routerLink]="['/adventures', adventure.id, 'edit']" class="btn btn-secondary">Edit</a>
            <button (click)="deleteAdventure(adventure.id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .adventure-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-section {
      margin-bottom: 40px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      letter-spacing: -0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .sync-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background-color: #f3f4f6;
      color: #6b7280;
    }
    
    .sync-status.connected {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .sync-status.disconnected {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    
    .sync-status.connected .status-dot {
      background-color: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    
    .sync-status.disconnected .status-dot {
      background-color: #ef4444;
      animation: none;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .filter-buttons, .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .filter-btn, .category-btn {
      padding: 10px 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: white;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .filter-btn::before, .category-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      transition: left 0.4s;
    }

    .filter-btn:hover::before, .category-btn:hover::before {
      left: 100%;
    }

    .filter-btn:hover, .category-btn:hover {
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .filter-btn.active, .category-btn.active {
      background: rgba(255, 255, 255, 0.35);
      color: white;
      border-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .adventures-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .adventure-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      animation: cardFadeIn 0.6s ease-out backwards;
    }

    @keyframes cardFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .adventure-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      opacity: 0;
      transition: opacity 0.4s;
    }

    .adventure-card:hover::before {
      opacity: 1;
    }

    .adventure-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 64px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .adventure-card.surprise {
      border-color: #fbbf24;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .card-title-section {
      flex: 1;
    }

    .adventure-title {
      margin: 0 0 10px 0;
      font-size: 1.35rem;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: -0.3px;
      line-height: 1.3;
    }

    .partner-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .partner-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
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

    .partner-badge.created-by {
      font-size: 11px;
      opacity: 0.85;
      border: 1px dashed currentColor;
    }

    .surprise-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background: #fbbf24;
      color: #78350f;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
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

    .photo-thumbnail {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 15px;
      background: #f3f4f6;
    }

    .photo-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-count {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .adventure-description {
      color: #6b7280;
      margin: 0 0 15px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .adventure-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #6b7280;
    }

    .meta-icon {
      font-size: 16px;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 24px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .empty-state h2 {
      margin: 0 0 12px 0;
      color: #1f2937;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 28px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .adventure-container {
        padding: 12px;
      }

      .header-section {
        margin-bottom: 20px;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 16px;
        gap: 12px;
      }

      .header-content h1 {
        font-size: 1.75rem;
      }

      .filter-section {
        gap: 10px;
      }

      .filter-buttons {
        gap: 8px;
      }

      .filter-btn {
        padding: 8px 14px;
        font-size: 12px;
        border-radius: 12px;
      }

      .adventures-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .adventure-card {
        padding: 16px;
        border-radius: 16px;
      }

      .adventure-title {
        font-size: 1.1rem;
        margin-bottom: 8px;
      }

      .card-header {
        margin-bottom: 12px;
      }

      .partner-badges {
        gap: 6px;
      }

      .partner-badge {
        padding: 3px 8px;
        font-size: 11px;
      }

      .status-badge {
        padding: 4px 10px;
        font-size: 11px;
      }

      .photo-thumbnail {
        margin-bottom: 12px;
        border-radius: 10px;
      }

      .adventure-description {
        margin-bottom: 12px;
        font-size: 13px;
      }

      .adventure-meta {
        gap: 8px;
        margin-bottom: 12px;
        padding-top: 12px;
      }

      .meta-item {
        font-size: 12px;
        gap: 4px;
      }

      .meta-icon {
        font-size: 14px;
      }

      .card-actions {
        gap: 8px;
      }

      .card-actions .btn {
        padding: 10px 16px;
        font-size: 13px;
        flex: 1;
      }

      .empty-state {
        padding: 40px 20px;
        border-radius: 16px;
      }

      .empty-icon {
        font-size: 56px;
        margin-bottom: 16px;
      }

      .empty-state h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .empty-state p {
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
  `]
})
export class AdventureListComponent implements OnInit {
  adventures: Adventure[] = [];
  filteredAdventures: Adventure[] = [];
  firebaseStatus = { connected: false, message: '' };
  selectedStatus: Adventure['status'] | null = null;
  selectedCategory: AdventureCategory | null = null;
  selectedCreatedBy: Partner | null = null;
  isLoading = false;

  categories = [
    { value: 'travel' as AdventureCategory, label: 'Travel', icon: '✈️' },
    { value: 'food' as AdventureCategory, label: 'Food', icon: '🍽️' },
    { value: 'activity' as AdventureCategory, label: 'Activity', icon: '🎯' },
    { value: 'milestone' as AdventureCategory, label: 'Milestone', icon: '🎉' },
    { value: 'date-night' as AdventureCategory, label: 'Date Night', icon: '💕' },
    { value: 'home' as AdventureCategory, label: 'Home', icon: '🏠' }
  ];

  constructor(private adventureService: AdventureService) {}

  ngOnInit(): void {
    this.loadAdventures();
    this.adventureService.adventures$.subscribe(adventures => {
      this.adventures = adventures;
      this.applyFilters();
    });
    this.adventureService.firebaseStatus$.subscribe(status => {
      this.firebaseStatus = status;
    });
    this.adventureService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  loadAdventures(): void {
    this.adventures = this.adventureService.getAllAdventures();
    this.applyFilters();
  }

  filterByStatus(status: Adventure['status'] | null): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  filterByCategory(category: AdventureCategory | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterByCreatedBy(createdBy: Partner | null): void {
    this.selectedCreatedBy = createdBy;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.adventures];

    // Filter by status
    if (this.selectedStatus !== null) {
      filtered = filtered.filter(a => a.status === this.selectedStatus);
    }

    // Filter by category
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(a => a.category === this.selectedCategory);
    }

    // Filter by created by
    if (this.selectedCreatedBy !== null) {
      filtered = filtered.filter(a => a.createdBy === this.selectedCreatedBy);
    }

    // Hide unrevealed surprises
    filtered = filtered.filter(a => !a.isSurprise || a.revealed);

    // Sort: completed by date (newest first), others by created date
    filtered.sort((a, b) => {
      if (a.status === 'completed' && b.status === 'completed') {
        const dateA = a.completedDate?.getTime() || 0;
        const dateB = b.completedDate?.getTime() || 0;
        return dateB - dateA;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    this.filteredAdventures = filtered;
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

  getCategoryLabel(category: AdventureCategory): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || category;
  }

  getCategoryIcon(category: AdventureCategory): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || '✨';
  }

  getPartnerLabel(partner: string): string {
    const labels: Record<string, string> = {
      'partner1': '👨 Doree',
      'partner2': '👩 Nobuu',
      'both': '💑 Both'
    };
    return labels[partner] || partner;
  }

  async deleteAdventure(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this adventure?')) {
      await this.adventureService.deleteAdventure(id);
    }
  }
}

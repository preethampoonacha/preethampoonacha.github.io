import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure, CoupleStats, Achievement, Partner, Surprise } from '../../models/task.model';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  template: `
    <app-loader *ngIf="isLoading"></app-loader>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>💑 Our Adventure Dashboard</h1>
        <div class="header-right">
          <div class="notification-bells">
            <div class="notification-bell" [class.has-notifications]="doreeAdventures.length > 0" (click)="filterByPartner('partner1')">
              <span class="bell-icon">👨</span>
              <span class="notification-count" *ngIf="doreeAdventures.length > 0">{{ doreeAdventures.length }}</span>
              <div class="notification-tooltip">Doree's Adventures</div>
            </div>
            <div class="notification-bell" [class.has-notifications]="nobuuAdventures.length > 0" (click)="filterByPartner('partner2')">
              <span class="bell-icon">👩</span>
              <span class="notification-count" *ngIf="nobuuAdventures.length > 0">{{ nobuuAdventures.length }}</span>
              <div class="notification-tooltip">Nobuu's Adventures</div>
            </div>
            <a routerLink="/surprises" class="notification-bell surprise-box-link" [class.has-notifications]="unrevealedSurprises.length > 0" title="Surprise Box">
              <span class="bell-icon">🎁</span>
              <span class="notification-count" *ngIf="unrevealedSurprises.length > 0">{{ unrevealedSurprises.length }}</span>
              <div class="notification-tooltip">Surprise Box</div>
            </a>
          </div>
          <a routerLink="/adventures/new" class="btn btn-primary">+ New Adventure</a>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" (click)="viewAllAdventures()" style="cursor: pointer;">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalAdventures }}</div>
            <div class="stat-label">Total Adventures</div>
          </div>
        </div>

        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.completedAdventures }}</div>
            <div class="stat-label">Completed</div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getCompletionPercentage()"></div>
              </div>
              <span class="progress-text">{{ getCompletionPercentage() }}%</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.averageRating.toFixed(1) }}</div>
            <div class="stat-label">Avg Rating</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.currentStreak }}</div>
            <div class="stat-label">Current Streak</div>
            <div class="stat-subtext">Best: {{ stats.longestStreak }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📸</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalPhotos }}</div>
            <div class="stat-label">Memories</div>
          </div>
        </div>

        <!-- Achievements stat card disabled -->
        <!-- <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ unlockedAchievements.length }}</div>
            <div class="stat-label">Achievements</div>
            <div class="stat-subtext">{{ allAchievements.length }} total</div>
          </div>
        </div> -->
      </div>

      <div class="category-stats collapsible-section">
        <div class="section-header-clickable" (click)="toggleSection('category')">
          <h2>Adventures by Category</h2>
          <span class="chevron" [class.expanded]="!isSectionCollapsed('category')">▼</span>
        </div>
        <div class="section-content" [class.collapsed]="isSectionCollapsed('category')">
          <div class="category-grid">
            <div *ngFor="let cat of getCategoryStats()" class="category-stat-card" (click)="filterByCategory(cat.value)" style="cursor: pointer;">
              <div class="category-icon">{{ cat.icon }}</div>
              <div class="category-info">
                <div class="category-name">{{ cat.label }}</div>
                <div class="category-count">{{ cat.count }} {{ cat.count === 1 ? 'adventure' : 'adventures' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements section disabled -->
      <!-- <div class="achievements-section collapsible-section">
        <div class="section-header-clickable" (click)="toggleSection('achievements')">
          <h2>🏆 Achievements</h2>
          <span class="chevron" [class.expanded]="!isSectionCollapsed('achievements')">▼</span>
        </div>
        <div class="section-content" [class.collapsed]="isSectionCollapsed('achievements')">
          <div class="achievements-grid">
            <div *ngFor="let achievement of allAchievements" class="achievement-card" [class.unlocked]="achievement.unlockedAt">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <div class="achievement-name">{{ achievement.name }}</div>
                <div class="achievement-description">{{ achievement.description }}</div>
                <div class="achievement-date" *ngIf="achievement.unlockedAt">
                  Unlocked {{ achievement.unlockedAt | date:'shortDate' }}
                </div>
              </div>
              <div class="achievement-status" *ngIf="!achievement.unlockedAt">🔒</div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="recent-section collapsible-section">
        <div class="section-header-clickable" (click)="toggleSection('upcoming')">
          <h2>📅 Upcoming Adventures</h2>
          <div class="section-header-actions">
            <a routerLink="/adventures" [queryParams]="{status: 'planned'}" class="view-all" (click)="$event.stopPropagation()">View All</a>
            <span class="chevron" [class.expanded]="!isSectionCollapsed('upcoming')">▼</span>
          </div>
        </div>
        <div class="section-content" [class.collapsed]="isSectionCollapsed('upcoming')">
          <div *ngIf="upcomingAdventures.length === 0" class="empty-mini">
            <p>No upcoming adventures planned</p>
          </div>
          <div class="adventures-mini-grid" *ngIf="upcomingAdventures.length > 0">
            <div *ngFor="let adventure of upcomingAdventures.slice(0, 3)" class="adventure-mini-card" [routerLink]="['/adventures', adventure.id]">
              <div class="mini-card-header">
                <h4>{{ adventure.title }}</h4>
                <span class="mini-badge">{{ getCategoryIcon(adventure.category) }}</span>
              </div>
              <div class="mini-card-meta" *ngIf="adventure.targetDate">
                📅 {{ adventure.targetDate | date:'shortDate' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-section collapsible-section">
        <div class="section-header-clickable" (click)="toggleSection('recent')">
          <h2>✨ Recent Completions</h2>
          <div class="section-header-actions">
            <a routerLink="/adventures" [queryParams]="{status: 'completed'}" class="view-all" (click)="$event.stopPropagation()">View All</a>
            <span class="chevron" [class.expanded]="!isSectionCollapsed('recent')">▼</span>
          </div>
        </div>
        <div class="section-content" [class.collapsed]="isSectionCollapsed('recent')">
          <div *ngIf="recentCompleted.length === 0" class="empty-mini">
            <p>No completed adventures yet</p>
          </div>
          <div class="adventures-mini-grid" *ngIf="recentCompleted.length > 0">
            <div *ngFor="let adventure of recentCompleted.slice(0, 3)" class="adventure-mini-card" [routerLink]="['/adventures', adventure.id]">
              <div class="mini-card-header">
                <h4>{{ adventure.title }}</h4>
                <div class="mini-badges">
                  <span class="mini-badge">{{ getCategoryIcon(adventure.category) }}</span>
                  <span class="mini-badge rating" *ngIf="adventure.rating">⭐ {{ adventure.rating }}</span>
                </div>
              </div>
              <div class="mini-card-meta" *ngIf="adventure.completedDate">
                ✅ {{ adventure.completedDate | date:'shortDate' }}
              </div>
              <div class="mini-photo" *ngIf="adventure.photos && adventure.photos.length > 0">
                <img [src]="adventure.photos[0]" [alt]="adventure.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .notification-bells {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .notification-bell {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .notification-bell:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 1);
    }

    .notification-bell.has-notifications {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      border-color: rgba(102, 126, 234, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    .surprise-box-link {
      text-decoration: none;
      color: inherit;
    }

    .surprise-box-link.has-notifications {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
      border-color: rgba(251, 191, 36, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
      }
      50% {
        box-shadow: 0 4px 24px rgba(102, 126, 234, 0.4);
      }
    }

    .bell-icon {
      font-size: 24px;
      transition: transform 0.3s;
    }

    .notification-bell:hover .bell-icon {
      transform: rotate(-15deg);
    }

    .notification-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 12px;
      min-width: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    .notification-tooltip {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }

    .notification-bell:hover .notification-tooltip {
      opacity: 1;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .stat-card.completed {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    }

    .stat-icon {
      font-size: 48px;
      line-height: 1;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-subtext {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }

    .stat-progress {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #10b981;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 12px;
      font-weight: 600;
      color: #065f46;
    }

    .category-stats, .achievements-section, .recent-section {
      margin-bottom: 40px;
    }

    .collapsible-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .section-header-clickable {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      padding: 8px 0;
      transition: all 0.2s;
    }

    .section-header-clickable:hover {
      opacity: 0.8;
    }

    .section-header-clickable h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.5rem;
    }

    .section-header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .chevron {
      font-size: 14px;
      color: #6b7280;
      transition: transform 0.3s ease;
      display: inline-block;
    }

    .chevron.expanded {
      transform: rotate(180deg);
    }

    .section-content {
      overflow: hidden;
      transition: max-height 0.3s ease, opacity 0.3s ease;
      max-height: 5000px;
      opacity: 1;
    }

    .section-content.collapsed {
      max-height: 0;
      opacity: 0;
      padding-top: 0;
      padding-bottom: 0;
    }

    .category-stats h2, .achievements-section h2, .recent-section h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.5rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .category-stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.2s;
    }

    .category-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .category-icon {
      font-size: 32px;
    }

    .category-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .category-count {
      font-size: 14px;
      color: #6b7280;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 15px;
    }

    .achievement-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      opacity: 0.6;
      transition: all 0.3s;
    }

    .achievement-card.unlocked {
      opacity: 1;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #fbbf24;
    }

    .achievement-icon {
      font-size: 40px;
    }

    .achievement-info {
      flex: 1;
    }

    .achievement-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .achievement-description {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .achievement-date {
      font-size: 12px;
      color: #9ca3af;
    }

    .achievement-status {
      font-size: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-content:not(.collapsed) {
      padding-top: 20px;
    }

    .view-all {
      color: #f5576c;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .adventures-mini-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }

    .adventure-mini-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .adventure-mini-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .mini-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .mini-card-header h4 {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
      flex: 1;
    }

    .mini-badges {
      display: flex;
      gap: 6px;
    }

    .mini-badge {
      padding: 4px 8px;
      border-radius: 8px;
      background: #f3f4f6;
      font-size: 12px;
      font-weight: 500;
    }

    .mini-badge.rating {
      background: #fef3c7;
      color: #92400e;
    }

    .mini-card-meta {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 10px;
    }

    .mini-photo {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .mini-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .empty-mini {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 12px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 12px;
      }

      .dashboard-header {
        margin-bottom: 16px;
        gap: 10px;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .notification-bell {
        width: 40px;
        height: 40px;
      }

      .bell-icon {
        font-size: 20px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }

      .stat-card {
        padding: 16px;
        gap: 12px;
      }

      .stat-icon {
        font-size: 32px;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-label {
        font-size: 12px;
      }

      .category-stats, .achievements-section, .recent-section {
        margin-bottom: 20px;
        padding: 16px;
      }

      .section-header-clickable h2 {
        font-size: 1.25rem;
      }

      .category-stats h2, .achievements-section h2, .recent-section h2 {
        font-size: 1.25rem;
        margin-bottom: 0;
      }

      .section-content:not(.collapsed) {
        padding-top: 16px;
      }

      .category-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .category-stat-card {
        padding: 12px;
        gap: 10px;
      }

      .category-icon {
        font-size: 24px;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .achievement-card {
        padding: 14px;
        gap: 12px;
      }

      .achievement-icon {
        font-size: 32px;
      }

      .adventures-mini-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .adventure-mini-card {
        padding: 12px;
      }

      .mini-card-header h4 {
        font-size: 14px;
      }

      .section-header {
        margin-bottom: 12px;
      }

      .empty-mini {
        padding: 24px 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: CoupleStats = {
    totalAdventures: 0,
    completedAdventures: 0,
    byCategory: {},
    byPartner: { partner1: 0, partner2: 0, both: 0 },
    averageRating: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPhotos: 0
  };
  upcomingAdventures: Adventure[] = [];
  recentCompleted: Adventure[] = [];
  allAchievements: Achievement[] = [];
  unlockedAchievements: Achievement[] = [];
  doreeAdventures: Adventure[] = [];
  nobuuAdventures: Adventure[] = [];
  isLoading = false;
  
  // Surprise Box (for notification badge only)
  unrevealedSurprises: Surprise[] = [];
  
  // Collapsible sections state (all collapsed by default)
  collapsedSections: { [key: string]: boolean } = {
    category: true,
    achievements: true,
    upcoming: true,
    recent: true
  };

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadSurprises();
    this.adventureService.adventures$.subscribe(() => {
      this.loadData();
    });
    this.adventureService.surprises$.subscribe(() => {
      this.loadSurprises();
    });
    // Achievements subscription disabled
    // this.adventureService.achievements$.subscribe(achievements => {
    //   this.allAchievements = achievements;
    //   this.unlockedAchievements = achievements.filter(a => a.unlockedAt);
    // });
    this.adventureService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  loadSurprises(): void {
    this.unrevealedSurprises = this.adventureService.getUnrevealedSurprises();
  }

  loadData(): void {
    this.stats = this.adventureService.getStats();
    this.upcomingAdventures = this.adventureService.getUpcomingAdventures();
    this.recentCompleted = this.adventureService.getCompletedAdventures();
    
    const allAdventures = this.adventureService.getAllAdventures();
    this.doreeAdventures = allAdventures.filter(a => 
      (a.assignedTo === 'partner1' || a.assignedTo === 'both') && 
      a.status !== 'completed'
    );
    this.nobuuAdventures = allAdventures.filter(a => 
      (a.assignedTo === 'partner2' || a.assignedTo === 'both') && 
      a.status !== 'completed'
    );
  }

  filterByPartner(partner: Partner): void {
    this.router.navigate(['/adventures'], { 
      queryParams: { assignedTo: partner } 
    });
  }

  filterByCategory(category: string): void {
    this.router.navigate(['/adventures'], { 
      queryParams: { category: category } 
    });
  }

  viewAllAdventures(): void {
    this.router.navigate(['/adventures']);
  }

  getCompletionPercentage(): number {
    if (this.stats.totalAdventures === 0) return 0;
    return Math.round((this.stats.completedAdventures / this.stats.totalAdventures) * 100);
  }

  getCategoryStats(): Array<{value: string; label: string; icon: string; count: number}> {
    const allAdventures = this.adventureService.getAllAdventures();
    const categoryCounts: Record<string, number> = {};
    
    // Count all adventures by category
    allAdventures.forEach(adventure => {
      const cat = adventure.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    return this.categories.map(cat => ({
      ...cat,
      count: categoryCounts[cat.value] || 0
    }));
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || '✨';
  }

  toggleSection(section: string): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  isSectionCollapsed(section: string): boolean {
    return this.collapsedSections[section] ?? true;
  }

}

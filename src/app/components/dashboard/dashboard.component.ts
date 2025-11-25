import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdventureService } from '../../services/adventure.service';
import { Adventure, CoupleStats, Achievement } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>💑 Our Adventure Dashboard</h1>
        <a routerLink="/adventures/new" class="btn btn-primary">+ New Adventure</a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
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

        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ unlockedAchievements.length }}</div>
            <div class="stat-label">Achievements</div>
            <div class="stat-subtext">{{ allAchievements.length }} total</div>
          </div>
        </div>
      </div>

      <div class="category-stats">
        <h2>Adventures by Category</h2>
        <div class="category-grid">
          <div *ngFor="let cat of getCategoryStats()" class="category-stat-card">
            <div class="category-icon">{{ cat.icon }}</div>
            <div class="category-info">
              <div class="category-name">{{ cat.label }}</div>
              <div class="category-count">{{ cat.count }} completed</div>
            </div>
          </div>
        </div>
      </div>

      <div class="achievements-section">
        <h2>🏆 Achievements</h2>
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

      <div class="recent-section">
        <div class="section-header">
          <h2>📅 Upcoming Adventures</h2>
          <a routerLink="/adventures" [queryParams]="{status: 'planned'}" class="view-all">View All</a>
        </div>
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

      <div class="recent-section">
        <div class="section-header">
          <h2>✨ Recent Completions</h2>
          <a routerLink="/adventures" [queryParams]="{status: 'completed'}" class="view-all">View All</a>
        </div>
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

    .category-stats h2, .achievements-section h2, .recent-section h2 {
      margin: 0 0 20px 0;
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
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .category-grid, .achievements-grid, .adventures-mini-grid {
        grid-template-columns: 1fr;
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
    this.loadData();
    this.adventureService.adventures$.subscribe(() => {
      this.loadData();
    });
    this.adventureService.achievements$.subscribe(achievements => {
      this.allAchievements = achievements;
      this.unlockedAchievements = achievements.filter(a => a.unlockedAt);
    });
  }

  loadData(): void {
    this.stats = this.adventureService.getStats();
    this.upcomingAdventures = this.adventureService.getUpcomingAdventures();
    this.recentCompleted = this.adventureService.getCompletedAdventures();
  }

  getCompletionPercentage(): number {
    if (this.stats.totalAdventures === 0) return 0;
    return Math.round((this.stats.completedAdventures / this.stats.totalAdventures) * 100);
  }

  getCategoryStats(): Array<{label: string; icon: string; count: number}> {
    return this.categories.map(cat => ({
      ...cat,
      count: this.stats.byCategory[cat.value] || 0
    })).filter(cat => cat.count > 0);
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.icon || '✨';
  }
}

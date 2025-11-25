import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="container" *ngIf="isAuthenticated">
      <nav class="main-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          💑 Dashboard
        </a>
        <a routerLink="/adventures" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
          📋 Adventures
        </a>
        <a routerLink="/timeline" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          📖 Timeline
        </a>
        <button (click)="logout()" class="logout-btn">🔒 Logout</button>
      </nav>
      <router-outlet></router-outlet>
    </div>
    <router-outlet *ngIf="!isAuthenticated"></router-outlet>
  `,
  styles: [`
    .main-nav {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.1);
    }

    .main-nav a:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .main-nav a.active {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .logout-btn {
      margin-left: auto;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.8);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 1);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .main-nav {
        flex-direction: column;
        gap: 10px;
      }

      .main-nav a {
        text-align: center;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Our Adventure List';
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
    });
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}


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
      gap: 12px;
      margin-bottom: 32px;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      letter-spacing: 0.2px;
    }

    .main-nav a::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .main-nav a:hover::before {
      left: 100%;
    }

    .main-nav a:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .main-nav a.active {
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .logout-btn {
      margin-left: auto;
      padding: 12px 24px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 15px;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
      position: relative;
      overflow: hidden;
    }

    .logout-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .logout-btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .logout-btn:hover {
      background: linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4);
    }

    .logout-btn:active {
      transform: scale(0.98);
    }

    @media (max-width: 768px) {
      .main-nav {
        flex-direction: column;
        gap: 10px;
        padding: 16px;
      }

      .main-nav a {
        text-align: center;
        width: 100%;
      }

      .logout-btn {
        margin-left: 0;
        width: 100%;
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


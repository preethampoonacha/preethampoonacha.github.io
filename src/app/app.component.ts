import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="container">
      <nav class="main-nav">
        <a routerLink="/tasks" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Tasks</a>
        <a routerLink="/signalr-poc" routerLinkActive="active">SignalR POC</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
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
export class AppComponent {
  title = 'Task Tracker';
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <div class="header">
        <h1>My Tasks</h1>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="sync-status" [class.connected]="firebaseStatus.connected" [class.disconnected]="!firebaseStatus.connected">
            <span class="status-dot"></span>
            <span class="status-text">{{ firebaseStatus.message }}</span>
          </div>
          <a routerLink="/tasks/new" class="btn btn-primary">+ New Task</a>
        </div>
      </div>

      <div *ngIf="tasks.length === 0" class="empty-state">
        <h2>No tasks yet</h2>
        <p>Get started by creating your first task!</p>
        <a routerLink="/tasks/new" class="btn btn-primary">Create Task</a>
      </div>

      <div *ngFor="let task of tasks" class="task-item">
        <div class="task-header">
          <div>
            <h3 class="task-title">{{ task.title }}</h3>
            <p class="task-description">{{ task.description }}</p>
          </div>
          <span class="badge badge-{{ task.status }}">{{ task.status }}</span>
        </div>
        
        <div class="task-meta">
          <span>
            <strong>Priority:</strong> {{ task.priority }}
          </span>
          <span>
            <strong>Created:</strong> {{ task.createdAt | date:'short' }}
          </span>
          <span *ngIf="task.updatedAt.getTime() !== task.createdAt.getTime()">
            <strong>Updated:</strong> {{ task.updatedAt | date:'short' }}
          </span>
        </div>

        <div class="task-actions">
          <a [routerLink]="['/tasks/edit', task.id]" class="btn btn-secondary">Edit</a>
          <button (click)="deleteTask(task.id)" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
    
    .status-text {
      white-space: nowrap;
    }
    
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 10px;
      }
      
      .sync-status {
        font-size: 11px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  firebaseStatus = { connected: false, message: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.taskService.firebaseStatus$.subscribe(status => {
      this.firebaseStatus = status;
    });
  }

  loadTasks(): void {
    this.tasks = this.taskService.getAllTasks();
  }

  async deleteTask(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this task?')) {
      await this.taskService.deleteTask(id);
    }
  }
}


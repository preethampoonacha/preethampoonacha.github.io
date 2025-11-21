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
        <a routerLink="/tasks/new" class="btn btn-primary">+ New Task</a>
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
  styles: []
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  loadTasks(): void {
    this.tasks = this.taskService.getAllTasks();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }
}


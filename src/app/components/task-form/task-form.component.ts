import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h1>
      </div>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            placeholder="Enter task title"
          />
          <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" 
               style="color: #ef4444; font-size: 12px; margin-top: 5px;">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" formControlName="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-success" [disabled]="taskForm.invalid">
            {{ isEditMode ? 'Update Task' : 'Create Task' }}
          </button>
          <a routerLink="/tasks" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending'],
      priority: ['medium']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    const task = this.taskService.getTaskById(id);
    if (task) {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority
      });
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, formValue);
      } else {
        this.taskService.createTask(formValue);
      }
      
      this.router.navigate(['/tasks']);
    }
  }
}


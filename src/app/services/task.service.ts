import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'task-tracker-tasks';
  private readonly NEXT_ID_KEY = 'task-tracker-next-id';
  
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private nextId = 1;

  constructor() {
    this.loadTasksFromStorage();
  }

  private loadTasksFromStorage(): void {
    try {
      const storedTasks = localStorage.getItem(this.STORAGE_KEY);
      const storedNextId = localStorage.getItem(this.NEXT_ID_KEY);

      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert date strings back to Date objects
        this.tasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      } else {
        // Initialize with sample data if no stored tasks
        this.tasks = [
          {
            id: 1,
            title: 'Welcome to Task Tracker',
            description: 'This is a sample task. You can edit or delete it to get started!',
            status: 'pending',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            title: 'Learn Angular',
            description: 'Explore Angular features and best practices',
            status: 'in-progress',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        this.nextId = 3;
        this.saveTasksToStorage();
      }

      if (storedNextId) {
        this.nextId = parseInt(storedNextId, 10);
      } else if (this.tasks.length > 0) {
        // Set nextId based on highest existing id
        this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
      }

      this.tasksSubject.next([...this.tasks]);
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      // Fallback to empty array if there's an error
      this.tasks = [];
      this.nextId = 1;
      this.tasksSubject.next([...this.tasks]);
    }
  }

  private saveTasksToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
      localStorage.setItem(this.NEXT_ID_KEY, this.nextId.toString());
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
    return newTask;
  }

  updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date()
    };
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
    return this.tasks[index];
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return false;
    }

    this.tasks.splice(index, 1);
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
    return true;
  }
}


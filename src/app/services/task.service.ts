import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { 
  collection, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'task-tracker-tasks';
  private readonly NEXT_ID_KEY = 'task-tracker-next-id';
  private readonly COLLECTION_NAME = 'tasks';
  
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private nextId = 1;
  private useFirestore = false;
  private unsubscribeSnapshot: (() => void) | null = null;
  
  // Firebase connection status
  private firebaseStatusSubject = new BehaviorSubject<{ connected: boolean; message: string }>({ 
    connected: false, 
    message: 'Checking connection...' 
  });
  public firebaseStatus$: Observable<{ connected: boolean; message: string }> = this.firebaseStatusSubject.asObservable();

  constructor() {
    // Check if Firebase is configured
    this.checkFirebaseConfig();
  }

  private checkFirebaseConfig(): void {
    try {
      // Check if Firebase is configured and db is available
      if (isFirebaseConfigured() && db) {
        this.useFirestore = true;
        this.firebaseStatusSubject.next({ connected: true, message: 'Synced with Firebase' });
        this.setupFirestoreListener();
      } else {
        // Fallback to localStorage
        console.info('Firebase not configured, using localStorage for task storage');
        this.firebaseStatusSubject.next({ connected: false, message: 'Using Local Storage (browser only)' });
        this.loadTasksFromStorage();
      }
    } catch (error) {
      console.warn('Firebase not configured, using localStorage:', error);
      this.firebaseStatusSubject.next({ connected: false, message: 'Using Local Storage (browser only)' });
      this.loadTasksFromStorage();
    }
  }

  private setupFirestoreListener(): void {
    try {
      if (!db) {
        throw new Error('Firestore database not initialized');
      }
      const tasksRef = collection(db, this.COLLECTION_NAME);
      
      // Try with orderBy first, but if it fails (no index or no data), try without
      let q;
      try {
        q = query(tasksRef, orderBy('createdAt', 'desc'));
      } catch (orderError) {
        console.warn('Could not use orderBy, trying without:', orderError);
        // If orderBy fails (e.g., no index), just query the collection
        q = query(tasksRef);
      }

      // Set up real-time listener for cross-browser synchronization
      this.unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          this.tasks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: data['id'] || parseInt(doc.id) || 0,
              title: data['title'],
              description: data['description'] || '',
              status: data['status'],
              priority: data['priority'],
              createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(data['createdAt']),
              updatedAt: data['updatedAt']?.toDate ? data['updatedAt'].toDate() : new Date(data['updatedAt'])
            } as Task;
          });
          
          // Sort by createdAt if we couldn't use orderBy
          if (this.tasks.length > 0) {
            this.tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            this.nextId = Math.max(...this.tasks.map(t => t.id), 0) + 1;
          }
          
          this.tasksSubject.next([...this.tasks]);
          // Update status to show successful connection
          this.firebaseStatusSubject.next({ connected: true, message: 'Synced with Firebase' });
        },
        (error: any) => {
          console.error('Error listening to Firestore:', error);
          console.error('Error code:', error?.code);
          console.error('Error message:', error?.message);
          
          // Provide more specific error messages
          let errorMessage = 'Firebase error - using Local Storage';
          if (error?.code === 'permission-denied') {
            errorMessage = 'Firebase: Permission denied - check Firestore rules';
          } else if (error?.code === 'failed-precondition') {
            errorMessage = 'Firebase: Index required - check console for link';
          } else if (error?.message) {
            errorMessage = `Firebase: ${error.message}`;
          }
          
          // Fallback to localStorage on error
          this.useFirestore = false;
          this.firebaseStatusSubject.next({ connected: false, message: errorMessage });
          this.loadTasksFromStorage();
        }
      );
    } catch (error: any) {
      console.error('Error setting up Firestore listener:', error);
      this.useFirestore = false;
      const errorMessage = error?.message || 'Firebase setup error - using Local Storage';
      this.firebaseStatusSubject.next({ connected: false, message: errorMessage });
      this.loadTasksFromStorage();
    }
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

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.useFirestore && db) {
      try {
        const tasksRef = collection(db, this.COLLECTION_NAME);
        const taskDoc = doc(tasksRef, newTask.id.toString());
        const taskData = {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          createdAt: Timestamp.fromDate(newTask.createdAt),
          updatedAt: Timestamp.fromDate(newTask.updatedAt)
        };
        await setDoc(taskDoc, taskData);
        // The real-time listener will update the tasks array automatically
        return newTask;
      } catch (error) {
        console.error('Error creating task in Firestore:', error);
        // Fallback to localStorage
        this.useFirestore = false;
        this.tasks.push(newTask);
        this.tasksSubject.next([...this.tasks]);
        this.saveTasksToStorage();
        return newTask;
      }
    } else {
      this.tasks.push(newTask);
      this.tasksSubject.next([...this.tasks]);
      this.saveTasksToStorage();
      return newTask;
    }
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date()
    };

    if (this.useFirestore && db) {
      try {
        const tasksRef = collection(db, this.COLLECTION_NAME);
        const taskDoc = doc(tasksRef, id.toString());
        const updateData: any = {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          updatedAt: Timestamp.fromDate(updatedTask.updatedAt)
        };
        await updateDoc(taskDoc, updateData);
        // The real-time listener will update the tasks array automatically
        return updatedTask;
      } catch (error) {
        console.error('Error updating task in Firestore:', error);
        // Fallback to localStorage
        this.useFirestore = false;
        this.tasks[index] = updatedTask;
        this.tasksSubject.next([...this.tasks]);
        this.saveTasksToStorage();
        return updatedTask;
      }
    } else {
      this.tasks[index] = updatedTask;
      this.tasksSubject.next([...this.tasks]);
      this.saveTasksToStorage();
      return updatedTask;
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return false;
    }

    if (this.useFirestore && db) {
      try {
        const tasksRef = collection(db, this.COLLECTION_NAME);
        const taskDoc = doc(tasksRef, id.toString());
        await deleteDoc(taskDoc);
        // The real-time listener will update the tasks array automatically
        return true;
      } catch (error) {
        console.error('Error deleting task in Firestore:', error);
        // Fallback to localStorage
        this.useFirestore = false;
        this.tasks.splice(index, 1);
        this.tasksSubject.next([...this.tasks]);
        this.saveTasksToStorage();
        return true;
      }
    } else {
      this.tasks.splice(index, 1);
      this.tasksSubject.next([...this.tasks]);
      this.saveTasksToStorage();
      return true;
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }
}


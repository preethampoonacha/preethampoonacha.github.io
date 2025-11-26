import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly PIN_KEY = 'adventure-pin';
  private readonly DEFAULT_PIN = '9302';
  private readonly AUTH_KEY = 'adventure-authenticated';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuth());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Always set PIN to default (9302) on initialization
    // This ensures the PIN is always correct, even on mobile devices
    localStorage.setItem(this.PIN_KEY, this.DEFAULT_PIN);
  }

  private checkAuth(): boolean {
    const auth = localStorage.getItem(this.AUTH_KEY);
    if (auth) {
      const authData = JSON.parse(auth);
      // Check if auth is still valid (24 hours)
      const now = new Date().getTime();
      if (now - authData.timestamp < 24 * 60 * 60 * 1000) {
        return true;
      } else {
        localStorage.removeItem(this.AUTH_KEY);
        return false;
      }
    }
    return false;
  }

  verifyPin(pin: string): boolean {
    const storedPin = localStorage.getItem(this.PIN_KEY);
    if (pin === storedPin) {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify({
        authenticated: true,
        timestamp: new Date().getTime()
      }));
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.checkAuth();
  }

  setPin(newPin: string): void {
    localStorage.setItem(this.PIN_KEY, newPin);
  }

  getPin(): string {
    return localStorage.getItem(this.PIN_KEY) || this.DEFAULT_PIN;
  }
}

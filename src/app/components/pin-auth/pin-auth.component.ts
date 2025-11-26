import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pin-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pin-container">
      <div class="pin-card">
        <div class="pin-header">
          <div class="pin-icon">💑</div>
          <h1>Our Adventures</h1>
          <p class="pin-subtitle">Enter your PIN</p>
        </div>
        
        <div class="pin-display">
          <div class="pin-dots">
            <span *ngFor="let dot of pinDots; let i = index" 
                  class="pin-dot" 
                  [class.filled]="dot"
                  [class.active]="i === pinValue.length && pinValue.length < 4">
            </span>
          </div>
        </div>

        <div class="pin-input-wrapper">
          <input
            type="password"
            #pinInput
            [(ngModel)]="pinValue"
            (input)="onPinInput()"
            (keyup.enter)="verifyPin()"
            maxlength="10"
            class="pin-input"
            autofocus
            inputmode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="pin-keypad">
          <button *ngFor="let num of keypadNumbers" 
                  class="keypad-btn"
                  (click)="addDigit(num)"
                  [disabled]="pinValue.length >= 10">
            {{ num }}
          </button>
          <button class="keypad-btn delete-btn" 
                  (click)="deleteDigit()"
                  [disabled]="pinValue.length === 0">
            ⌫
          </button>
        </div>

        <button class="pin-submit-btn" 
                (click)="verifyPin()" 
                [disabled]="pinValue.length < 4"
                [class.ready]="pinValue.length >= 4">
          <span *ngIf="pinValue.length < 4">Enter PIN</span>
          <span *ngIf="pinValue.length >= 4">Continue →</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .pin-container{position:fixed;inset:0;background:linear-gradient(135deg,#f093fb 0%,#f5576c 50%,#4facfe 100%);display:flex;align-items:center;justify-content:center;padding:20px;z-index:9999}
    .pin-card{background:#fff;border-radius:32px;padding:32px 24px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center}
    .pin-header{margin-bottom:32px}
    .pin-icon{font-size:56px;margin-bottom:12px;animation:float 3s ease-in-out infinite}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .pin-card h1{margin:0 0 8px;font-size:1.5rem;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700}
    .pin-subtitle{color:#6b7280;margin:0;font-size:14px;font-weight:500}
    .pin-display{margin-bottom:24px}
    .pin-dots{display:flex;justify-content:center;gap:16px}
    .pin-dot{width:14px;height:14px;border-radius:50%;border:2px solid #e5e7eb;background:#fff;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative}
    .pin-dot.filled{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);border-color:#f5576c;transform:scale(1.2);box-shadow:0 0 12px rgba(245,87,108,.4)}
    .pin-dot.active{animation:pulse 1s ease-in-out infinite}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,87,108,.7)}50%{box-shadow:0 0 0 8px rgba(245,87,108,0)}}
    .pin-input-wrapper{position:relative;margin-bottom:20px}
    .pin-input{width:100%;padding:14px;border:2px solid #e5e7eb;border-radius:16px;font-size:20px;text-align:center;letter-spacing:12px;font-weight:600;outline:none;transition:all .2s;background:#f9fafb}
    .pin-input:focus{border-color:#f5576c;box-shadow:0 0 0 4px rgba(245,87,108,.1);background:#fff}
    .error-message{color:#ef4444;font-size:13px;margin-bottom:16px;min-height:20px;font-weight:500}
    .pin-keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;max-width:300px;margin-left:auto;margin-right:auto}
    .keypad-btn{aspect-ratio:1;border:none;border-radius:16px;background:linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%);font-size:24px;font-weight:600;color:#1f2937;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px rgba(0,0,0,.05);touch-action:manipulation}
    .keypad-btn:active{transform:scale(.95);background:linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%);box-shadow:0 1px 2px rgba(0,0,0,.1)}
    .keypad-btn:disabled{opacity:.4;cursor:not-allowed}
    .delete-btn{background:linear-gradient(135deg,#fee2e2 0%,#fecaca 100%);color:#dc2626;font-size:20px}
    .delete-btn:active{background:linear-gradient(135deg,#fecaca 0%,#fca5a5 100%)}
    .pin-submit-btn{width:100%;padding:16px;border:none;border-radius:16px;background:#e5e7eb;color:#9ca3af;font-size:16px;font-weight:600;cursor:not-allowed;transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .pin-submit-btn.ready{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#fff;cursor:pointer;box-shadow:0 4px 16px rgba(245,87,108,.4)}
    .pin-submit-btn.ready:active{transform:scale(.98)}
    .pin-hint{margin-top:16px;color:#9ca3af;font-size:12px}
    @media (max-width:480px){.pin-card{padding:28px 20px;border-radius:24px}.pin-icon{font-size:48px}.pin-card h1{font-size:1.25rem}.pin-dots{gap:12px}.pin-dot{width:12px;height:12px}.pin-keypad{gap:10px;max-width:280px}.keypad-btn{font-size:22px;border-radius:14px}.pin-submit-btn{padding:14px;font-size:15px}}
    @media (min-width:481px){.keypad-btn:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,.1)}.pin-submit-btn.ready:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(245,87,108,.5)}}
  `]
})
export class PinAuthComponent implements OnInit, AfterViewInit {
  @ViewChild('pinInput') pinInput!: ElementRef<HTMLInputElement>;
  
  pinValue = '';
  pinDots: boolean[] = [false, false, false, false];
  errorMessage = '';
  keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngAfterViewInit(): void {
    // Focus input on mobile keyboards
    if (this.pinInput) {
      setTimeout(() => {
        this.pinInput.nativeElement.focus();
      }, 300);
    }
  }

  onPinInput(): void {
    this.errorMessage = '';
    for (let i = 0; i < 4; i++) {
      this.pinDots[i] = i < this.pinValue.length;
    }
  }

  addDigit(digit: number): void {
    if (this.pinValue.length < 10) {
      this.pinValue += digit.toString();
      this.onPinInput();
      // Auto-submit if 4 digits entered
      if (this.pinValue.length === 4) {
        setTimeout(() => this.verifyPin(), 200);
      }
    }
  }

  deleteDigit(): void {
    if (this.pinValue.length > 0) {
      this.pinValue = this.pinValue.slice(0, -1);
      this.onPinInput();
    }
  }

  verifyPin(): void {
    if (this.pinValue.length < 4) {
      this.errorMessage = 'PIN must be 4 digits';
      return;
    }

    if (this.authService.verifyPin(this.pinValue)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Incorrect PIN';
      this.pinValue = '';
      this.pinDots = [false, false, false, false];
      setTimeout(() => {
        if (this.pinInput) {
          this.pinInput.nativeElement.focus();
        }
      }, 100);
    }
  }
}
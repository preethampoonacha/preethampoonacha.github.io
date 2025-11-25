import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay">
      <div class="loader-container">
        <div class="loader-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loader-text">Loading adventures...</div>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .loader-spinner {
      position: relative;
      width: 80px;
      height: 80px;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring:nth-child(1) {
      animation-delay: -0.45s;
      border-top-color: #667eea;
    }

    .spinner-ring:nth-child(2) {
      animation-delay: -0.3s;
      border-top-color: #764ba2;
      width: 70%;
      height: 70%;
      top: 15%;
      left: 15%;
    }

    .spinner-ring:nth-child(3) {
      animation-delay: -0.15s;
      border-top-color: #f093fb;
      width: 50%;
      height: 50%;
      top: 25%;
      left: 25%;
    }

    .spinner-ring:nth-child(4) {
      border-top-color: #f5576c;
      width: 30%;
      height: 30%;
      top: 35%;
      left: 35%;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loader-text {
      color: white;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    @media (max-width: 768px) {
      .loader-spinner {
        width: 60px;
        height: 60px;
      }

      .loader-text {
        font-size: 14px;
      }
    }
  `]
})
export class LoaderComponent {}


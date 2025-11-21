import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignalRService, SignalRMessage, SignalRStatus } from '../../services/signalr.service';
import { HubConnectionState } from '@microsoft/signalr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signalr-poc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="header">
        <h1>SignalR POC</h1>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="sync-status" [class.connected]="signalRStatus.connected" [class.disconnected]="!signalRStatus.connected">
            <span class="status-dot"></span>
            <span class="status-text">{{ signalRStatus.message }}</span>
          </div>
          <button 
            *ngIf="!signalRStatus.connected" 
            (click)="connect()" 
            class="btn btn-primary">
            Connect
          </button>
          <button 
            *ngIf="signalRStatus.connected" 
            (click)="disconnect()" 
            class="btn btn-danger">
            Disconnect
          </button>
        </div>
      </div>

      <div class="connection-config">
        <div class="form-group">
          <label for="hubUrl">SignalR Hub URL</label>
          <input
            type="text"
            id="hubUrl"
            [(ngModel)]="hubUrl"
            placeholder="https://localhost:5001/chathub"
            [disabled]="signalRStatus.connected"
          />
          <small style="color: #6b7280; font-size: 12px; margin-top: 5px; display: block;">
            Enter your SignalR hub endpoint URL
          </small>
        </div>
      </div>

      <div class="message-section">
        <div class="form-group">
          <label for="userName">Your Name</label>
          <input
            type="text"
            id="userName"
            [(ngModel)]="userName"
            placeholder="Enter your name"
            [disabled]="!signalRStatus.connected"
          />
        </div>

        <div class="form-group">
          <label for="messageInput">Message</label>
          <div style="display: flex; gap: 10px;">
            <input
              type="text"
              id="messageInput"
              [(ngModel)]="messageInput"
              placeholder="Type your message..."
              (keyup.enter)="sendMessage()"
              [disabled]="!signalRStatus.connected"
              style="flex: 1;"
            />
            <button 
              (click)="sendMessage()" 
              class="btn btn-success"
              [disabled]="!signalRStatus.connected || !messageInput.trim() || !userName.trim()">
              Send
            </button>
          </div>
        </div>
      </div>

      <div class="messages-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h2 style="margin: 0; color: #111827;">Messages</h2>
          <button 
            (click)="clearMessages()" 
            class="btn btn-secondary"
            [disabled]="messages.length === 0">
            Clear
          </button>
        </div>

        <div *ngIf="messages.length === 0" class="empty-state">
          <h2>No messages yet</h2>
          <p>Connect to a SignalR hub and start sending messages!</p>
        </div>

        <div class="messages-container">
          <div *ngFor="let msg of messages" class="message-item">
            <div class="message-header">
              <strong class="message-user">{{ msg.user }}</strong>
              <span class="message-time">{{ msg.timestamp | date:'short' }}</span>
            </div>
            <p class="message-content">{{ msg.message }}</p>
          </div>
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

    .connection-config {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .message-section {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .messages-section {
      margin-top: 20px;
    }

    .messages-container {
      max-height: 500px;
      overflow-y: auto;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      background: #f9fafb;
    }

    .message-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
    }

    .message-item:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .message-user {
      color: #667eea;
      font-size: 14px;
    }

    .message-time {
      color: #6b7280;
      font-size: 12px;
    }

    .message-content {
      color: #374151;
      margin: 0;
      line-height: 1.6;
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

      .message-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  `]
})
export class SignalRPocComponent implements OnInit, OnDestroy {
  messages: SignalRMessage[] = [];
  signalRStatus: SignalRStatus = {
    connected: false,
    message: 'Disconnected',
    connectionState: HubConnectionState.Disconnected
  };
  hubUrl = 'https://localhost:5001/chathub';
  userName = '';
  messageInput = '';

  private messagesSubscription?: Subscription;
  private statusSubscription?: Subscription;

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.messages = this.signalRService.getMessages();
    
    this.messagesSubscription = this.signalRService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    this.statusSubscription = this.signalRService.status$.subscribe(status => {
      this.signalRStatus = status;
    });
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  async connect(): Promise<void> {
    try {
      await this.signalRService.connect(this.hubUrl);
    } catch (error) {
      alert(`Failed to connect: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.signalRService.disconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.messageInput.trim() || !this.userName.trim()) {
      return;
    }

    try {
      await this.signalRService.sendMessage(this.userName, this.messageInput);
      this.messageInput = '';
    } catch (error) {
      alert(`Failed to send message: ${error}`);
    }
  }

  clearMessages(): void {
    this.signalRService.clearMessages();
  }
}


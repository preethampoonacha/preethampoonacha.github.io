import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SignalRMessage {
  user: string;
  message: string;
  timestamp: Date;
}

export interface SignalRStatus {
  connected: boolean;
  message: string;
  connectionState: HubConnectionState;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: HubConnection;
  private messagesSubject = new BehaviorSubject<SignalRMessage[]>([]);
  public messages$: Observable<SignalRMessage[]> = this.messagesSubject.asObservable();
  
  private statusSubject = new BehaviorSubject<SignalRStatus>({
    connected: false,
    message: 'Disconnected',
    connectionState: HubConnectionState.Disconnected
  });
  public status$: Observable<SignalRStatus> = this.statusSubject.asObservable();

  private messages: SignalRMessage[] = [];

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    // Default to a common SignalR endpoint - user can configure this
    const url = 'https://localhost:5001/chathub'; // Change this to your SignalR hub URL
    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.onreconnecting(() => {
      this.updateStatus({
        connected: false,
        message: 'Reconnecting...',
        connectionState: HubConnectionState.Reconnecting
      });
    });

    this.hubConnection.onreconnected(() => {
      this.updateStatus({
        connected: true,
        message: 'Connected',
        connectionState: HubConnectionState.Connected
      });
    });

    this.hubConnection.onclose(() => {
      this.updateStatus({
        connected: false,
        message: 'Disconnected',
        connectionState: HubConnectionState.Disconnected
      });
    });

    // Listen for messages from the server
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.addMessage({
        user,
        message,
        timestamp: new Date()
      });
    });

    // Listen for broadcast messages
    this.hubConnection.on('BroadcastMessage', (user: string, message: string) => {
      this.addMessage({
        user,
        message,
        timestamp: new Date()
      });
    });
  }

  async connect(url?: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    if (url && this.hubConnection) {
      await this.disconnect();
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();
      this.setupEventHandlers();
    }

    if (!this.hubConnection) {
      this.initializeConnection();
    }

    if (!this.hubConnection) {
      throw new Error('Failed to initialize SignalR connection');
    }

    try {
      this.updateStatus({
        connected: false,
        message: 'Connecting...',
        connectionState: HubConnectionState.Connecting
      });

      await this.hubConnection.start();
      
      this.updateStatus({
        connected: true,
        message: 'Connected',
        connectionState: HubConnectionState.Connected
      });
    } catch (error) {
      this.updateStatus({
        connected: false,
        message: `Connection failed: ${error}`,
        connectionState: HubConnectionState.Disconnected
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.updateStatus({
        connected: false,
        message: 'Disconnected',
        connectionState: HubConnectionState.Disconnected
      });
    }
  }

  async sendMessage(user: string, message: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('SendMessage', user, message);
        // Optionally add the message locally immediately
        this.addMessage({
          user,
          message,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    } else {
      throw new Error('Not connected to SignalR hub');
    }
  }

  async broadcastMessage(user: string, message: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('BroadcastMessage', user, message);
      } catch (error) {
        console.error('Error broadcasting message:', error);
        throw error;
      }
    } else {
      throw new Error('Not connected to SignalR hub');
    }
  }

  private addMessage(message: SignalRMessage): void {
    this.messages = [...this.messages, message];
    this.messagesSubject.next(this.messages);
  }

  private updateStatus(status: SignalRStatus): void {
    this.statusSubject.next(status);
  }

  getMessages(): SignalRMessage[] {
    return this.messages;
  }

  clearMessages(): void {
    this.messages = [];
    this.messagesSubject.next(this.messages);
  }

  getConnectionState(): HubConnectionState {
    return this.hubConnection?.state ?? HubConnectionState.Disconnected;
  }
}


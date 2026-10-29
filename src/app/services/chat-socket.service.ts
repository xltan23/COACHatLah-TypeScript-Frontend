import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { MessageResponse } from '../models';

// Live delivery channel over STOMP. Conversation history still loads via
// MessageService.getConversationHistory (REST + Redis).
@Injectable({ providedIn: 'root' })
export class ChatSocketService {

  private wsUrl = `${environment.apiUrl}/ws`;
  private client?: Client;

  readonly connected = signal(false);

  // Delivered messages pushed to this user (both messages they send and receive).
  readonly incoming$ = new Subject<MessageResponse>();
  // The sender's own flagged messages: category + rephrase suggestion.
  readonly moderation$ = new Subject<MessageResponse>();

  connect(userId: string): void {
    if (this.client?.active) {
      return;
    }
    // If client is not activate yet, activate it
    this.client = new Client({
      // userId is the prototype identity; the server reads it in the handshake.
      webSocketFactory: () => new SockJS(`${this.wsUrl}?userId=${encodeURIComponent(userId)}`),
      reconnectDelay: 5000,
      onConnect: () => {
        this.connected.set(true);
        this.client!.subscribe('/user/queue/messages', (m: IMessage) =>
          this.incoming$.next(JSON.parse(m.body) as MessageResponse));
        this.client!.subscribe('/user/queue/moderation', (m: IMessage) =>
          this.moderation$.next(JSON.parse(m.body) as MessageResponse));
      },
      onWebSocketClose: () => this.connected.set(false),
      onStompError: (frame) =>
        console.error('STOMP error:', frame.headers['message'], frame.body),
    });

    this.client.activate();
  }

  // senderId is NOT sent - the server takes it from the handshake Principal.
  send(recipientId: string, content: string): void {
    if (!this.client?.connected) {
      console.warn('Socket not connected; message not sent'); 
      return;
    }
    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ recipientId, content }),
    });
  }

  disconnect(): void {
    this.client?.deactivate();
    this.connected.set(false);
  }
}

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
import { ChatSocketService } from '../services/chat-socket.service';
import { LoginService } from '../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageDto, MessageResponse } from '../models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [MaterialImports, CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-message-platform',
  styleUrl: './message-platform.css',
  templateUrl: './message-platform.html',
})
export class MessagePlatform implements OnInit, OnDestroy {

  me!: string;      // current user (from LoginService)
  peerId!: string;  // conversation partner (from route)
  messages = signal<MessageDto[]>([]);
  messageForm!: FormGroup;
  messageResp = signal<MessageResponse | null>(null);

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private loginSvc: LoginService,
    private messageSvc: MessageService,
    private chatSocket: ChatSocketService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.me = this.loginSvc.userId()!; // guaranteed non-null by authGuard
    this.messageForm = this.createMessage();

    this.subs.add(this.activatedRoute.params.subscribe(params => {
      this.peerId = params['peerId'];
      this.messageForm.patchValue({ senderId: this.me, recipientId: this.peerId });

      this.messageSvc.getConversationHistory(this.me, this.peerId)
        .subscribe(result => this.messages.set(result));
    }));

    this.chatSocket.connect(this.me);

    this.subs.add(this.chatSocket.incoming$.subscribe(resp => {
      const m = resp.message;
      if (!m) return;
      const inThisConversation =
        (m.senderId === this.me && m.recipientId === this.peerId) ||
        (m.senderId === this.peerId && m.recipientId === this.me);
      if (inThisConversation) {
        this.messages.update(list => [...list, m]);
      }
      if (m.senderId === this.me) {
        this.messageResp.set(resp);
      }
    }));

    this.subs.add(this.chatSocket.moderation$.subscribe(resp => this.messageResp.set(resp)));
  }

  private createMessage(): FormGroup {
    return this.fb.group({
      senderId: this.fb.control({ value: '', disabled: true }),
      recipientId: this.fb.control({ value: '', disabled: true }),
      content: this.fb.control('', [Validators.required]),
    });
  }

  processMessage(): void {
    const content = this.messageForm.value.content as string;
    this.chatSocket.send(this.peerId, content);
    this.messageForm.patchValue({ content: '' });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.chatSocket.disconnect();
  }
}

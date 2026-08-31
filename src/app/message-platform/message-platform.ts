import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
import { ChatSocketService } from '../services/chat-socket.service';
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

  uid1!: string; // local user ("me")
  uid2!: string; // conversation peer
  messages = signal<MessageDto[]>([]);
  messageForm!: FormGroup;
  messageResp = signal<MessageResponse | null>(null);

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private messageSvc: MessageService,
    private chatSocket: ChatSocketService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.messageForm = this.createMessage();

    this.subs.add(this.activatedRoute.params.subscribe(params => {
      this.uid1 = params['uid1'];
      this.uid2 = params['uid2'];
      this.messageForm.patchValue({ senderId: this.uid1, recipientId: this.uid2 });

      // Load history (REST + Redis)
      this.messageSvc.getConversationHistory(this.uid1, this.uid2)
        .subscribe(result => this.messages.set(result));

      // Open the live socket as this user
      this.chatSocket.connect(this.uid1);
    }));

    // Delivered messages (sent or received) - append if in the open conversation
    this.subs.add(this.chatSocket.incoming$.subscribe(resp => {
      const m = resp.message;
      if (!m) return;
      const inThisConversation =
        (m.senderId === this.uid1 && m.recipientId === this.uid2) ||
        (m.senderId === this.uid2 && m.recipientId === this.uid1);
      if (inThisConversation) {
        this.messages.update(list => [...list, m]);
      }
      if (m.senderId === this.uid1) {
        this.messageResp.set(resp);
      }
    }));

    // This user's own flagged messages
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
    this.chatSocket.send(this.uid2, content);
    this.messageForm.patchValue({ content: '' });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.chatSocket.disconnect();
  }
}

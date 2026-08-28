import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
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

  uid1!:string;
  uid2!:string;
  llmRephrase!:string;
  messages = signal<MessageDto[]>([]);
  params$!:Subscription;
  messageForm!:FormGroup
  messageResp!:MessageResponse

  constructor(private fb:FormBuilder, private messageSvc:MessageService, private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    console.log("Initialising Messaging Platform Component...")
    this.params$ = this.activatedRoute.params.subscribe(
      (params) => {
        this.uid1 = params["uid1"];
        this.uid2 = params["uid2"];
        console.log("Submitting request for messages between both users: %s %s", this.uid1, this.uid2);
        this.messageSvc.getConversationHistory(this.uid1, this.uid2)
          .subscribe(result => {
            console.log("Messages received: ", result)
            this.messages.set(result)
          })
      }
    )
    this.messageForm = this.createMessage()
  }

  private createMessage():FormGroup {
    return this.fb.group({
      senderId:this.fb.control('', [Validators.required]),
      recipientId:this.fb.control('', [Validators.required]),
      content:this.fb.control('', [Validators.required])
    })
  }

  processMessage() {
    console.log("Submitting message form...")
    const messageDto = this.messageForm.value as MessageDto
    this.messageSvc.sendMessage(messageDto)
      .then(result => {
        console.log(result)
        this.messageResp = result
      })
      .catch(err => {
        console.error("Error sending message", err)
      })
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
  }
}

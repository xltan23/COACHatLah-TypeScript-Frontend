import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialImports } from '../material-imports';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageDto } from '../models';

@Component({
  imports: [MaterialImports, CommonModule],
  selector: 'app-message-platform',
  styleUrl: './message-platform.css',
  templateUrl: './message-platform.html',
})
export class MessagePlatform implements OnInit, OnDestroy {

  uid1!:string;
  uid2!:string;
  messages = signal<MessageDto[]>([]);
  params$!:Subscription;

  constructor(private messageSvc:MessageService, private activatedRoute:ActivatedRoute) {}

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
  }

  ngOnDestroy(): void {
    this.params$.unsubscribe();
  }
}

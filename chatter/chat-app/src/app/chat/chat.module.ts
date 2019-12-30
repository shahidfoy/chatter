import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from './message/message.component';



@NgModule({
  declarations: [ChatComponent, MessageComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }

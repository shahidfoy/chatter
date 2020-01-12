import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { MessageService } from './services/message.service';
import { ChatListComponent } from './chat-list/chat-list.component';

@NgModule({
  declarations: [
    ChatComponent,
    MessageComponent,
    ChatListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule,
  ],
  exports: [ChatComponent],
  providers: [MessageService]
})
export class ChatModule { }

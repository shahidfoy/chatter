import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from '../shared/header/header.component';



@NgModule({
  declarations: [
    ChatComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule,
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }

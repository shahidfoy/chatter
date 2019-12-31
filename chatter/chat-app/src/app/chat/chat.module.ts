import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from '../shared/header/header.component';
import { MessageService } from './services/message.service';



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
  ],
  providers: [
    MessageService,
  ]
})
export class ChatModule { }

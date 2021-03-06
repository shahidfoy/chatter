import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageComponent } from './message/message.component';
import { SharedModule } from '../shared/shared.module';
import { MessageService } from './services/message.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../shared/services/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    ChatComponent,
    MessageComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule,
  ],
  exports: [ChatComponent],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ]
})
export class ChatModule { }

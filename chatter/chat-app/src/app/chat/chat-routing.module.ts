import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { AuthGuard } from '../shared/services/guards/auth.guard';
import { MessageComponent } from './message/message.component';
import { NotificationsComponent } from '../chat/notifications/notifications.component';


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: NotificationsComponent },
      { path: 'notifications', component: NotificationsComponent},
      { path: 'message', component: MessageComponent },
      { path: 'message/:username', component: MessageComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class ChatRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { AuthGuard } from '../guards/auth.guard';
import { MessageComponent } from './message/message.component';


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
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

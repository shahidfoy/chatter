import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  { path: '404', component: NotFoundComponent },
  { path: 'chat', component: ChatComponent },
  { path: '', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

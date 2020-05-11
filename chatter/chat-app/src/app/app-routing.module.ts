import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  { path: '404', component: NotFoundComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'streams',
    loadChildren: () =>
      import('./streams/streams.module').then(m => m.StreamsModule)
  },
  { path: '**', pathMatch: 'full', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

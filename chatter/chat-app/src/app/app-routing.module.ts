import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './streams/profile/profile.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';


const routes: Routes = [
  { path: '404', component: NotFoundComponent },
  { path: '', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from './streams.component';
import { AuthGuard } from '../guards/auth.guard';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentsComponent } from './posts/comments/comments.component';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'post/:id', component: CommentsComponent, canActivate: [AuthGuard] },
      { path: 'posts', component: PostsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  // {
  //   path: 'post/:id',
  //   component: CommentsComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }

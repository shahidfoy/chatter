import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from './streams.component';
import { AuthGuard } from '../shared/services/guards/auth.guard';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChangePasswordModalComponent } from '../shared/change-password/change-password-modal.component';
import { CommentsComponent } from './posts/comments/comments.component';

const routes: Routes = [
  {
    path: '',
    component: StreamsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'change-password', component: ChangePasswordModalComponent },
      { path: 'followers', component: UsersComponent },
      { path: 'followers/:username', component: UsersComponent },
      { path: 'following', component: UsersComponent },
      { path: 'following/:username', component: UsersComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'post/comments/:id', component: CommentsComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:username', component: ProfileComponent },
      
      { path: 'trending', component: PostsComponent },
      { path: 'users', component: UsersComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }

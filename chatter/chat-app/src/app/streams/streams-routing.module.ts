import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from './streams.component';
import { AuthGuard } from '../shared/services/guards/auth.guard';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentsComponent } from './posts/comments/comments.component';
import { UsersComponent } from './users/users.component';
import { FollowersComponent } from './users/followers/followers.component';
import { FollowingComponent } from './users/following/following.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TrendingComponent } from './trending/trending.component';
import { ChangePasswordModalComponent } from '../shared/change-password-modal/change-password-modal.component';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'post/:id', component: CommentsComponent, canActivate: [AuthGuard] },
      { path: 'posts', component: PostsComponent },
      { path: 'trending', component: TrendingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:username', component: ProfileComponent },
      { path: 'followers', component: FollowersComponent },
      { path: 'followers/:username', component: FollowersComponent },
      { path: 'following', component: FollowingComponent },
      { path: 'following/:username', component: FollowingComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'change-password', component: ChangePasswordModalComponent }
    ]
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }

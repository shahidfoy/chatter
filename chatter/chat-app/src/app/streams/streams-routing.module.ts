import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from './streams.component';
import { AuthGuard } from '../guards/auth.guard';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentsComponent } from './posts/comments/comments.component';
import { UsersComponent } from './users/users.component';
import { FollowersComponent } from './users/followers/followers.component';
import { FollowingComponent } from './users/following/following.component';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'post/:id', component: CommentsComponent, canActivate: [AuthGuard] },
      { path: 'posts', component: PostsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:username', component: ProfileComponent },
      { path: 'users/followers', component: FollowersComponent },
      { path: 'users/followers/:username', component: FollowersComponent },
      { path: 'users/following', component: FollowingComponent },
      { path: 'users/following/:username', component: FollowingComponent },
      { path: 'users', component: UsersComponent  },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule { }

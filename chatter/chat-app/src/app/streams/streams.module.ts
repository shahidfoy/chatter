import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from './streams.component';
import { SideNavComponent } from '../shared/side-nav/side-nav.component';
import { PostsComponent } from './posts/posts.component';
import { SharedModule } from '../shared/shared.module';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { ProfileComponent } from './profile/profile.component';
import { StreamsRoutingModule } from './streams-routing.module';
import { PostService } from './services/post.service';
import { CommentsComponent } from './posts/comments/comments.component';
import { UsersComponent } from './users/users.component';
import { FollowingComponent } from './users/following/following.component';
import { FollowersComponent } from './users/followers/followers.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TrendingComponent } from './trending/trending.component';
import { UserService } from './services/user.service';
import { UploadImageModalComponent } from './profile/upload-image-modal/upload-image-modal.component';
import { PostModalComponent } from './posts/post-modal/post-modal.component';

@NgModule({
  declarations: [
    StreamsComponent,
    PostsComponent,
    PostFormComponent,
    ProfileComponent,
    CommentsComponent,
    UsersComponent,
    FollowingComponent,
    FollowersComponent,
    NotificationsComponent,
    TrendingComponent,
    UploadImageModalComponent,
    PostModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StreamsRoutingModule,
  ],
  exports: [StreamsComponent],
  providers: [PostService, UserService]
})
export class StreamsModule { }

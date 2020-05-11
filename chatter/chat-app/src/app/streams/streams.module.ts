import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from './streams.component';
import { PostsComponent } from './posts/posts.component';
import { SharedModule } from '../shared/shared.module';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { ProfileComponent } from './profile/profile.component';
import { StreamsRoutingModule } from './streams-routing.module';
import { PostService } from './services/post.service';
import { CommentsComponent } from './posts/comments/comments.component';
import { UsersComponent } from './users/users.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserService } from './services/user.service';
import { UploadImageModalComponent } from './profile/upload-image-modal/upload-image-modal.component';
import { PostModalComponent } from './posts/post-modal/post-modal.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../shared/services/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    StreamsComponent,
    PostsComponent,
    PostFormComponent,
    ProfileComponent,
    CommentsComponent,
    UsersComponent,
    NotificationsComponent,
    UploadImageModalComponent,
    PostModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StreamsRoutingModule,
  ],
  exports: [StreamsComponent],
  providers: [
    PostService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ]
})
export class StreamsModule { }

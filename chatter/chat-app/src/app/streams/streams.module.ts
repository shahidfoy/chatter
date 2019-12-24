import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from './streams.component';
import { TokenService } from '../services/token.service';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PostsComponent } from './posts/posts.component';
import { SharedModule } from '../shared/shared.module';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { ProfileComponent } from './profile/profile.component';
import { StreamsRoutingModule } from './streams-routing.module';
import { PostService } from './services/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './posts/comments/comments.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    StreamsComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    PostsComponent,
    ActionBarComponent,
    PostFormComponent,
    ProfileComponent,
    CommentsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StreamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [StreamsComponent],
  providers: [TokenService, PostService]
})
export class StreamsModule { }

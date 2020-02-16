import { NgModule, ErrorHandler } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from './services/token.service';
import { ApplicationStateService } from './services/application-state.service';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ChangePasswordModalComponent } from './change-password/change-password-modal.component';
import { GenericErrorHandler } from './services/generic-error.handler';
import { NgxMasonryModule } from 'ngx-masonry';
import { ImageService } from './services/image.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { LoadingComponent } from './loading/loading.component';

const socketConfig: SocketIoConfig = { url: `${environment.BASEURL}`, options: {} };

@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent,
    SideNavComponent,
    ChangePasswordModalComponent,
    LoadingComponent,
  ],
  imports: [
    RouterModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMasonryModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  exports: [
    SocketIoModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMasonryModule,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent,
    SideNavComponent,
    ChangePasswordModalComponent,
    LoadingComponent,
  ],
  providers: [
    ImageService,
    TokenService,
    ApplicationStateService,
    { provide: ErrorHandler, useClass: GenericErrorHandler }
  ]
})
export class SharedModule { }

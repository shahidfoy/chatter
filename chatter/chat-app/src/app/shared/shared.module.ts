import { NgModule } from '@angular/core';
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
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent,
    SideNavComponent,
    ChangePasswordModalComponent,
  ],
  imports: [
    RouterModule,
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NgZorroAntdModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent,
    SideNavComponent,
    ChangePasswordModalComponent,
  ],
  providers: [
    TokenService,
    ApplicationStateService,
  ]
})
export class SharedModule { }

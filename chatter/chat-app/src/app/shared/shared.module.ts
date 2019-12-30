import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ActionBarComponent } from './action-bar/action-bar.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent
  ],
  imports: [
    NgZorroAntdModule,
    RouterModule,
  ],
  exports: [
    NgZorroAntdModule,
    HeaderComponent,
    FooterComponent,
    ActionBarComponent
  ]
})
export class SharedModule { }

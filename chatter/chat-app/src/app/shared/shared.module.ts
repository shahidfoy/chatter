import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    NgZorroAntdModule,
    RouterModule,
  ],
  exports: [
    NgZorroAntdModule,
  ],
  declarations: [NotFoundComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  imports: [
    NgZorroAntdModule,
  ],
  exports: [
    NgZorroAntdModule,
  ],
  declarations: [NotFoundComponent]
})
export class SharedModule { }

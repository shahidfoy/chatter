import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  imports: [
    NgZorroAntdModule,
  ],
  exports: [
    NgZorroAntdModule,
  ]
})
export class SharedModule { }

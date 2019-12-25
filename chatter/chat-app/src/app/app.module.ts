import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { AuthModule } from './auth/auth.module';
import { StreamsModule } from './streams/streams.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { StreamsRoutingModule } from './streams/streams-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from './shared/shared.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

registerLocaleData(en);

const socketConfig: SocketIoConfig = { url: `${environment.BASEURL}`, options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    AuthModule,
    AuthRoutingModule,
    StreamsModule,
    StreamsRoutingModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [
    CookieService,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

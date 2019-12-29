import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<CustomRequest>, next: HttpHandler): Observable<HttpEvent<CustomRequest>> {
    const jwtToken = this.tokenService.getToken();

    if (jwtToken) {
      const cloned = req.clone({
        headers: req.headers.set('auth', `${jwtToken}`)
      });

      return next.handle(cloned);
    } else {
      const cloned = req.clone({
        headers: req.headers.delete('auth')
      });

      return next.handle(cloned);
    }
  }
}

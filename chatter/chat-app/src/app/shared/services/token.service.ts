import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtPayload, PayloadData } from '../interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly CHAT_TOKEN: string = 'chat_token';
  private payload: JwtPayload;

  constructor(private cookieService: CookieService) { }

  setToken(token: string) {
    this.cookieService.set(this.CHAT_TOKEN, token);
    // localStorage.setItem(this.CHAT_TOKEN, token);
  }

  getToken(): string {
    return this.cookieService.get(this.CHAT_TOKEN);
    // return localStorage.getItem(this.CHAT_TOKEN);
  }

  deleteToken() {
    this.cookieService.delete(this.CHAT_TOKEN, '/');
    // localStorage.removeItem(this.CHAT_TOKEN);
  }

  getPayload(): PayloadData {
    const token = this.getToken();
    let payloadStr: string;
    if (token) {
      payloadStr = token.split('.')[1]; // jwt payload
      this.payload = JSON.parse(window.atob(payloadStr));
    }
    console.log('PAYLOAD', this.payload.data);
    return this.payload.data;
  }
}

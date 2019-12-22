import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['/streams']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

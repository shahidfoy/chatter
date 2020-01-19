import { Component, OnInit } from '@angular/core';
import { TokenService } from '../shared/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['/streams']);
    }
  }
}

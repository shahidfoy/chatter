import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PayloadData } from '../interfaces/jwt-payload.interface';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  payload: PayloadData;
  isCollapsed = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.payload = this.tokenService.getPayload();
    this.authService.logoutUser(this.payload._id).subscribe();
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

}

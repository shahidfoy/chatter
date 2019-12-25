import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  isCollapsed = false;

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

}

import { Component, OnInit } from '@angular/core';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { User } from 'src/app/interfaces/user.interface';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  loggedInUser: PayloadData;
  loggedInUserData: User;

  constructor(private tokenService: TokenService) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    console.log('logged in user', this.loggedInUser);
  }

}

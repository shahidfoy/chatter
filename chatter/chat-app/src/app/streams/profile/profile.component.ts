import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../app/services/token.service';
import { PayloadData } from '../../../app/interfaces/jwt-payload.interface';
import { UserPost } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  payload: PayloadData;
  username: string;
  posts: UserPost[];

  constructor(private tokenService: TokenService) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.username = this.payload.username;
    this.posts = this.payload.posts;

    console.log(this.payload);
  }
}

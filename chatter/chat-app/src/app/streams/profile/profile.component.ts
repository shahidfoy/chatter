import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { PayloadData } from '../../interfaces/jwt-payload.interface';
import { UserPost } from '../../streams/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  payload: PayloadData;
  username: string;
  posts: UserPost[];
  onUsersProfile = false;

  constructor(
    private tokenService: TokenService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.username = this.router.snapshot.params.username;
    this.onUsersProfile = false;
    if (!this.username) {
      this.payload = this.tokenService.getPayload();
      this.username = this.payload.username;
      this.posts = this.payload.posts;
      this.onUsersProfile = true;
    }

  }
}

import { Component, OnInit, Input } from '@angular/core';
import { PayloadData } from '../interfaces/jwt-payload.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from 'src/app/streams/services/user.service';
import { ImageService } from 'src/app/streams/services/image.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'NERDOJO';
  @Input() isMobile: boolean;
  @Input() payload: PayloadData;
  user: User;
  username: string;

  avatarUrl: string;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.username = this.payload.username;
    this.getUser();
  }

  // TODO:: EMIT NEW PROFILE IMAGE WHEN NEW PROFILE IS UPLOADED

  private getUser() {
    this.userService.getUserById(this.payload._id).subscribe((user: User) => {
      this.user = user;

      if (user.picId) {
        this.avatarUrl = this.imageService.getUserProfileImage(user.picVersion, user.picId);
      } else {
        this.avatarUrl = this.imageService.getDefaultProfileImage();
      }
    });
  }
}

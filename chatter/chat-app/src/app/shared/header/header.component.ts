import { Component, OnInit, Input } from '@angular/core';
import { PayloadData } from '../interfaces/jwt-payload.interface';
import { User } from '../interfaces/user.interface';
import { UserService } from 'src/app/streams/services/user.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { ApplicationStateService } from '../services/application-state.service';

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
    private applicationStatusService: ApplicationStateService,
  ) { }

  ngOnInit() {
    this.username = this.payload.username;
    this.getUser();

    this.avatarUrl = this.payload.picId ?
      this.imageService.getImage(this.payload.picVersion, this.payload.picId) :
      this.avatarUrl = this.imageService.getDefaultProfileImage();

    this.imageService.profileImageSubject.subscribe((imageUrl: string) => {
      this.avatarUrl = imageUrl;
    });
  }

  /**
   * emits true for isCollased
   */
  closeSideNav() {
    this.applicationStatusService.isCollapsed.next(true);
  }

  /**
   * gets user by id and sets the users profile image
   */
  private getUser() {
    this.userService.getUserById(this.payload._id).subscribe((user: User) => {
      this.user = user;

      if (user.picId) {
        this.avatarUrl = this.imageService.getImage(user.picVersion, user.picId);
      } else {
        this.avatarUrl = this.imageService.getDefaultProfileImage();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserFollowed } from '../../interfaces/user-followed.interface';
import { UserService } from '../../services/user.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {

  users: User[];
  loggedInUser: PayloadData;
  loggedInUserData: User;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  /**
   * follows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    this.userService.followUser(userId).subscribe((followingUserId: string) => {
      // TODO:: NOIFY USER THAT THEY ARE FOLLOWING THE OTHER USER

      // this.loggedInUserData.following.push({ userFollowed: { _id: userId } });
      // note:: emitting might use above method to pass the data
      this.userService.emitNewFollowSocket();
    });
  }

  /**
   * uses lodash to check if the user id is in the logged in users following array
   * @param array array of followed users
   * @param userId users id
   */
  checkUserInFollowedArray(array: UserFollowed[], userId: string) {
    return _.find(array, [ 'userFollowed._id', userId ]);
  }

}

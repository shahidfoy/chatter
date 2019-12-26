import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { PayloadData } from '../../../interfaces/jwt-payload.interface';
import { UserFollowed } from '../../interfaces/user-followed.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {

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

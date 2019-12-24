import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../../app/interfaces/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

}

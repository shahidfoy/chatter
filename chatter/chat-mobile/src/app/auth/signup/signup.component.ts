import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {}

  navLogin() {
    this.navController.navigateBack('auth/login');
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title = 'Game Chatter';
  @Input() isMobile: boolean;
  @Input() payload: PayloadData;
  username: string;

  constructor() { }

  ngOnInit() {
    this.username = this.payload.username;
  }

}

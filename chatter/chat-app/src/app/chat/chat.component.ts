import { Component, OnInit } from '@angular/core';
import { PayloadData } from '../shared/interfaces/jwt-payload.interface';
import { TokenService } from '../shared/services/token.service';
import { ApplicationStateService } from '../shared/services/application-state.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  isCollapsed = false;
  isMobile: boolean;
  payload: PayloadData;

  constructor(
    private tokenService: TokenService,
    private applicationStateService: ApplicationStateService,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

}

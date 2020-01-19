import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from '../shared/services/application-state.service';
import { TokenService } from '../shared/services/token.service';
import { PayloadData } from '../shared/interfaces/jwt-payload.interface';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {

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

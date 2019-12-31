import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  chatingWithUsername: string;

  data = [
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.chatingWithUsername = this.activatedRoute.snapshot.params.username;
  }
}

import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

const fakeData = [
  {
    gender: 'male',
    name: {
    title: 'Mr',
    first: 'Ryan',
    last: 'Lowe'
    },
    email: 'ryan.lowe@example.com',
    nat: 'AU'
    },
    {
    gender: 'female',
    name: {
    title: 'Ms',
    first: 'Annabelle',
    last: 'Ross'
    },
    email: 'annabelle.ross@example.com',
    nat: 'CA'
    },
    {
    gender: 'female',
    name: {
    title: 'Mrs',
    first: 'Silviara',
    last: 'Nascimento'
    },
    email: 'silviara.nascimento@example.com',
    nat: 'BR'
    },
    {
    gender: 'female',
    name: {
    title: 'Ms',
    first: 'Sofie',
    last: 'Hansen'
    },
    email: 'sofie.hansen@example.com',
    nat: 'DK'
    },
    {
    gender: 'male',
    name: {
    title: 'Mr',
    first: 'Dale',
    last: 'Anderson'
    },
    email: 'dale.anderson@example.com',
    nat: 'IE'
    },
    {
      gender: 'male',
      name: {
      title: 'Mr',
      first: 'Ryan',
      last: 'Lowe'
      },
      email: 'ryan.lowe@example.com',
      nat: 'AU'
      },
      {
      gender: 'female',
      name: {
      title: 'Ms',
      first: 'Annabelle',
      last: 'Ross'
      },
      email: 'annabelle.ross@example.com',
      nat: 'CA'
      },
      {
      gender: 'female',
      name: {
      title: 'Mrs',
      first: 'Silviara',
      last: 'Nascimento'
      },
      email: 'silviara.nascimento@example.com',
      nat: 'BR'
      },
      {
      gender: 'female',
      name: {
      title: 'Ms',
      first: 'Sofie',
      last: 'Hansen'
      },
      email: 'sofie.hansen@example.com',
      nat: 'DK'
      },
      {
      gender: 'male',
      name: {
      title: 'Mr',
      first: 'Dale',
      last: 'Anderson'
      },
      email: 'dale.anderson@example.com',
      nat: 'IE'
      }
];

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];

  constructor(private http: HttpClient, private msg: NzMessageService) {}

  ngOnInit() {
    this.getData((res: any) => {
      this.data = fakeData;
      this.list = res.results;
      this.initLoading = false;
    });
  }

  getData(callback: (res: any) => void): void {
    // this.http.get(fakeDataUrl).subscribe((res: any) => callback(res));
    this.data = fakeData;
    this.data.concat(this.data);
    this.list = [...this.data];
    this.initLoading = false;
  }

  // onLoadMore(): void {
  //   this.loadingMore = true;
  //   this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
  //   this.http.get(fakeDataUrl).subscribe((res: any) => {
  //     this.data = this.data.concat(res.results);
  //     this.list = [...this.data];
  //     this.loadingMore = false;
  //   });
  // }

  edit(item: any): void {
    this.msg.success(item.email);
  }
}

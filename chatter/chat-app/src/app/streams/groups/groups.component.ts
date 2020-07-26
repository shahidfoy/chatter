import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { Tag } from '../interfaces/tag.interface';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  tags: Tag[];
  isMobile: boolean;

  constructor(
    private groupsService: GroupsService,
    private applicationStateService: ApplicationStateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.applicationStateService.isMobile.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });

    this.groupsService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
  }

  navigateToPosts(tag: string) {
    this.router.navigateByUrl(`/streams/posts/${tag}`);
  }
}

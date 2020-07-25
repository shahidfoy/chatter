import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { Tag } from '../interfaces/tag.interface';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  tags: Tag[];

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsService.getTags().subscribe((tags: Tag[]) => {
      console.log('tags', tags);
      this.tags = tags;
    });
  }

}

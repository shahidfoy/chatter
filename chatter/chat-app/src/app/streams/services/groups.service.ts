import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../interfaces/tag.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  /**
   * get tags for groups
   */
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.BASEURL}/api/groups/tags`);
  }
}

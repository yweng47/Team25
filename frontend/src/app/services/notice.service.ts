import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class NoticeService {

  constructor(private http: HttpClient) {
  }

  createNotice(content: string): Observable<any> {
    return this.http.post(apiUrl.notice, {
      content
    });
  }

  getNotice(): Observable<any> {
    return this.http.get(apiUrl.notice);
  }
}

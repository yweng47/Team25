import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class TAService {

  constructor(private http: HttpClient) {
  }

  getCourseTA(): Observable<any> {
    return this.http.get(apiUrl.courseTA);
  }

  getTAHours(courseId?: string, email?: string): Observable<any> {
    const params: any = {};
    if (courseId) {
      params.courseId = courseId;
    }
    if (email) {
      params.email = email;
    }
    return this.http.get(apiUrl.taHour, {
      params
    });
  }
}

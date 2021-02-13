import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class CourseService {

  constructor(private http: HttpClient) {
  }

  getCourseByCode(code: string): Observable<any> {
    return this.http.get(apiUrl.getCourseByCode, {
      params: {
        code
      }
    });
  }
}

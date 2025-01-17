import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class TAService {

  constructor(private http: HttpClient) {
  }

  getCourseTA(userId?: string): Observable<any> {
    const params: any = {};
    if (userId) {
      params.userId = userId;
    }
    return this.http.get(apiUrl.courseTA, {
      params
    });
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

  assignTAHour(name: string, email: string, hour: string, enrollment: string): Observable<any> {
    return this.http.post(apiUrl.taHour, {
      name,
      email,
      hour,
      enrollment
    });
  }

  updateTAHour(id: string, hour: string, enrollment: string): Observable<any> {
    return this.http.put(apiUrl.taHour, {
      id,
      hour,
      enrollment
    });
  }

  deleteTAHour(id: string): Observable<any> {
    return this.http.delete(apiUrl.taHour, {
      params: {
        id
      }
    });
  }
}

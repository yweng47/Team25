import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class EnrolmentHourService {

  constructor(private http: HttpClient) {
  }

  importEnrolmentHours(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(apiUrl.importEnrolmentHours, formData);
  }

  getAllEnrolmentHours(course?: string): Observable<any> {
    const params: any = {};
    if (course) {
      params.course = course;
    }
    return this.http.get(apiUrl.enrolmentHours, {
      params
    });
  }
}

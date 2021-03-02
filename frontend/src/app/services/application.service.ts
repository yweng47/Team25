import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  constructor(private http: HttpClient) {
  }

  importApplications(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(apiUrl.importApplications, formData);
  }

  getAllApplications(): Observable<any> {
    return this.http.get(apiUrl.applications);
  }
}

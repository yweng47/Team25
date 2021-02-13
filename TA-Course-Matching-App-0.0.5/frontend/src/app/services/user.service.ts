import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(apiUrl.login, {
      email,
      password
    });
  }

  getUsers(role?: string): Observable<any> {
    const params: any = {};
    if (role) {
      params.role = role;
    }
    return this.http.get(apiUrl.user, {
      params
    });
  }

  inviteSignUp(userId: string, email: string): Observable<any> {
    return this.http.post(apiUrl.inviteRegister, {
      id: userId,
      email
    });
  }
}

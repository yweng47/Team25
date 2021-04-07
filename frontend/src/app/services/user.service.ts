import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class UserService {

  userInfo: any = {};

  constructor(private http: HttpClient) {}

  getCurrentUser(): any {
    if (!this.userInfo._id) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.userInfo = JSON.parse(currentUser);
      }
    }
    return this.userInfo;
  }

  clearCurrentUser(): any {
    if (this.userInfo._id) {
      localStorage.removeItem('currentUser');
      this.userInfo = {};
    }
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

  inviteSignUp(email: string): Observable<any> {
    return this.http.post(apiUrl.inviteRegister, {
      email
    });
  }

  checkToken(token: string): Observable<any> {
    return this.http.post(apiUrl.checkToken, {
      access_token: token
    });
  }

  changeUserChair(id: string, isChair: boolean): Observable<any> {
    return this.http.post(apiUrl.changeUserChair, {
      id,
      isChair
    });
  }

  signUp(email, password, name, relateCourses): Observable<any> {
    return this.http.post(apiUrl.user, {
      email,
      password,
      name,
      roles: ['6025614a3e59453a5c39fe50'],
      relateCourses,
    });
  }
}

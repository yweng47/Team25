import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import apiUrl from '../config/url.config';

@Injectable({ providedIn: 'root' })
export class QuestionService {

  constructor(private http: HttpClient) {
  }

  getQuestions(course?: string, user?: string): Observable<any> {
    const params: any = {};
    if (course) {
      params.course = course;
    }
    if (user) {
      params.user = user;
    }
    return this.http.get(apiUrl.question, {
      params
    });
  }

  addOrUpdateQuestion(question: any): Observable<any> {
    return this.http.post(apiUrl.question, question);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import apiUrl from '../config/url.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  constructor(private http: HttpClient) {}

  getReview(userId?: string): Observable<any> {
    const params: any = {};
    if (userId) {
      params.userId = userId;
    }
    return this.http.get(apiUrl.review, {
      params
    });
  }

  getReviewById(id: string): Observable<any> {
    return this.http.get(apiUrl.review + '/' + id);
  }

  addReview(review: any): Observable<any> {
    return this.http.post(apiUrl.review, {
      ...review
    });
  }

  getRestTas(courseId: string): Observable<any> {
    return this.http.get(apiUrl.restTas, {
      params: {
        courseId
      }
    });
  }

  getAllocation(): Observable<any> {
    return this.http.get(apiUrl.allocation);
  }

  updateAllocation(allocations: any): Observable<any> {
    return this.http.put(apiUrl.allocation, allocations);
  }
}

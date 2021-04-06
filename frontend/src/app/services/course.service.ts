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

  getCourseByUserId(id: string): Observable<any> {
    return this.http.get(apiUrl.course, {
      params: {
        id
      }
    });
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(apiUrl.course + '/' + id);
  }

  updateCourse(course: any): Observable<any> {
    return this.http.put(apiUrl.course , {
      ...course
    });
  }

  getTaCourse(): Observable<any> {
    return this.http.get(apiUrl.taCourse);
  }

  updateTaCourse(taCourse): Observable<any> {
    return this.http.post(apiUrl.taCourse, {
      ...taCourse
    });
  }

  getAllCourses(keyword: string, pageNum: number, pageSize: number): Observable<any> {
    return this.http.get(apiUrl.courses, {
      params: {
        keyword,
        pageNum: String(pageNum),
        pageSize: String(pageSize),
      }
    });
  }
}

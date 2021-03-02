import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  displayedColumns = ['subject', 'catalog', 'section', 'description', 'actions'];
  courses = [];

  constructor(
    private courseService: CourseService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    const userInfo = this.userService.userInfo;
    this.courseService.getCourseByUserId(userInfo._id).subscribe(response => {
      if (response.code === 200) {
        this.courses = response.data;
      }
    });
  }
}


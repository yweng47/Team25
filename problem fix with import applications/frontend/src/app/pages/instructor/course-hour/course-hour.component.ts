import { Component, OnInit } from '@angular/core';
import { EnrolmentHourService } from '../../../services/enrolmentHour.service';
import { UserService } from '../../../services/user.service';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-hour',
  templateUrl: './course-hour.component.html',
  styleUrls: ['./course-hour.component.css']
})
export class CourseHourComponent implements OnInit {

  enrolmentHours = [];
  displayedColumns: string[] = ['course', 'current_ta_hours'];

  constructor(
    private enrolmentHourService: EnrolmentHourService,
    private userService: UserService,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    const userInfo = this.userService.getCurrentUser();
    this.courseService.getCourseByUserId(userInfo._id).subscribe(response => {
      if (response.code === 200) {
        const coursesStr = response.data.map(course => course._id).join(',');
        this.getEnrollmentHours(coursesStr);
      }
    });
  }

  getEnrollmentHours(courses: string): void {
    this.enrolmentHourService.getAllEnrollmentHours(courses).subscribe(response => {
      if (response.code) {
        this.enrolmentHours = response.data;
      }
    });
  }
}

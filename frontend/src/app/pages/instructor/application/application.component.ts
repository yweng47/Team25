import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  courses = [];
  applicants = [];
  currentCourse: any = {};
  rankingApplicants = [];

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    const userInfo = this.userService.userInfo;
    this.courseService.getCourseByUserId(userInfo._id).subscribe(response => {
      if (response.code === 200) {
        this.courses = response.data;
        this.currentCourse = this.courses[0];
        this.getApplicants();
      }
    });
  }

  getApplicants(): void {
    this.applicationService.getAllApplications(this.currentCourse._id).subscribe(response => {
      if (response.code === 200) {
        this.applicants = response.data;
        this.applicants = this.applicants.sort((a, b) => {
          return a.order - b.order;
        });
      }
    });
  }

  listOrderChanged(event): void {
    this.rankingApplicants = event;
    this.rankingApplicants.forEach((applicant, index) => {
      applicant.order = index + 1;
    });
  }

  completeRanking(): void {
    if (this.rankingApplicants.length === 0) {
      this.toastr.warning('The ranking has not been modified');
      return;
    }
    this.applicationService.updateAllApplication(this.rankingApplicants).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('update ranking success');
      } else {
        this.toastr.success('update ranking error');
      }
    });
  }

  switchCourse(course): void {
    if (course === this.currentCourse) {
      return;
    }
    this.currentCourse = course;
    this.getApplicants();
  }
}

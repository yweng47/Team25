import { Component, OnInit } from '@angular/core';
import { TAService } from '../../../services/ta.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { sheet2blob, startToDownload } from '../../../utils/utils';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../../services/review.service';
import { TA_COURSE_STATUS } from '../../../config/ta-course-status';
import { MatDialog } from '@angular/material/dialog';
import { ApproveRejectTaCourseComponent } from '../../../modals/approve-reject-ta-course/approve-reject-ta-course.component';

@Component({
  selector: 'app-instructor-course-ta',
  templateUrl: './instructor-course-ta.component.html',
  styleUrls: ['./instructor-course-ta.component.css']
})
export class InstructorCourseTaComponent implements OnInit {

  courseTAs = [];
  displayedColumns: string[] = ['course', 'ta_num', 'actions'];
  review = null;

  constructor(
    private taService: TAService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.getCourseTAs();
    this.getReview();
  }

  getCourseTAs(): void {
    const userInfo = this.userService.getCurrentUser();
    this.taService.getCourseTA(userInfo._id).subscribe(response => {
      if (response.code === 200) {
        this.courseTAs = response.data;
      }
    });
  }

  getReview(): void {
    const userInfo = this.userService.getCurrentUser();
    this.reviewService.getReview(userInfo._id).subscribe(response => {
      if (response.code === 200) {
        this.review = response.data;
      }
    });
  }

  download(): void {
    const courseTAData = this.courseTAs.map(courseTA => {
      const courseCode = courseTA.courses[0].subject + courseTA.courses[0].catalog;
      const userName = courseTA.name;
      const userEmail = courseTA.email;
      const numberOfTA = courseTA.allocations.length;
      return [ courseCode, userName, userEmail, numberOfTA ];
    });
    const wsData = [
      [ 'Course Code', 'Instructor Name', 'Instructor Email', 'Number of TAs Assigned' ],
      ...courseTAData
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(wsData);
    startToDownload(sheet2blob(workSheet), 'CourseTAAssigned.xlsx');
  }

  goTAHours(courseId: string): void {
    this.router.navigate(['/instructor/taHour/' + courseId]);
  }

  approveCourseTa(courseTA: any): void {
    const userInfo = this.userService.getCurrentUser();
    const review = {
      user: userInfo._id,
      review: TA_COURSE_STATUS.APPROVE,
      course: courseTA.courses[0]._id
    };
    this.reviewService.addReview(review).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('success accept');
        this.getReview();
      }
    });
  }

  rejectCourseTa(courseTA: any): void {
    const dialogRef = this.dialog.open(ApproveRejectTaCourseComponent, {
      width: '500px',
      data: courseTA.courses[0]._id
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.getReview();
      }
    });
  }

  reviewCourseTa(accept: boolean): void {
    if (this.courseTAs.length > 0) {
      const userInfo = this.userService.getCurrentUser();
      const review = {
        user: userInfo._id,
        review: accept
      };
      this.reviewService.addReview(review).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success(`success ${accept ? 'accept' : 'reject'}`);
          this.getReview();
        }
      });
    } else {
      this.toastr.warning('empty ta courses');
    }
  }

  hasReview(courseId: string): boolean {
    if (Array.isArray(this.review)) {
      return !this.review.find(r => r.course === courseId);
    }
  }
}

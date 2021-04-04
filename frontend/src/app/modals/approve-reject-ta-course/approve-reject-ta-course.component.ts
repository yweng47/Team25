import { Component, Inject, OnInit } from '@angular/core';
import { TAService } from '../../services/ta.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewService } from '../../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { TA_COURSE_STATUS } from '../../config/ta-course-status';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-approve-reject-ta-course',
  templateUrl: './approve-reject-ta-course.component.html',
  styleUrls: ['./approve-reject-ta-course.component.css']
})
export class ApproveRejectTaCourseComponent implements OnInit {
  courseId = '';
  taHours = [];
  restTas = [];
  selectApplication = null;
  displayedColumns: string[] = ['email', 'name', 'ta_hours', 'actions'];

  constructor(
    private taService: TAService,
    private reviewService: ReviewService,
    private userService: UserService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ApproveRejectTaCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseId = data;
  }

  ngOnInit(): void {
    this.getTaHours();
    this.getRestTa();
  }

  getTaHours(): void {
    this.taService.getTAHours(this.courseId).subscribe(response => {
      if (response.code === 200) {
        this.taHours = response.data;
      }
    });
  }

  getRestTa(): void {
    const restTas = [];
    this.reviewService.getRestTas(this.courseId).subscribe(applicationResp => {
      const applications = applicationResp.data;
      this.reviewService.getAllocation().subscribe(allocationResp => {
        const allocations = allocationResp.data;
        applications.forEach(application => {
          const noAssignApplications = allocations.filter(allocation => allocation.applicant_email === application.applicant_email);
          if (noAssignApplications.length === 0 || (noAssignApplications.length === 1 && noAssignApplications[0].hour === 5)) {
            restTas.push(application);
          }
        });
        this.restTas = restTas;
      });
    });
  }

  deleteTa(taHour: any): void {
    const index = this.taHours.indexOf(taHour);
    const newTaHours = [].concat(this.taHours);
    if (index !== -1) {
      this.restTas = [...this.restTas, newTaHours[index] ];
      newTaHours.splice(index, 1);
      this.taHours = [...newTaHours];
    }
  }

  addApplication(): void {
    if (!this.selectApplication) {
      this.toastr.warning('please select a ta');
      return;
    }
    const index = this.restTas.indexOf(this.selectApplication);
    const newRestTas = [].concat(this.restTas);
    if (index !== -1) {
      this.taHours = [].concat(this.taHours, [{
        ...this.selectApplication,
        hour: 10
      }]);
      newRestTas.splice(index, 1);
      this.restTas = [...newRestTas];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    const totalHour = this.taHours.reduce((total, ta) => total += ta.hour, 0);
    if (this.taHours.length > 0) {
      const currentTAHour = this.taHours[0].enrolments.current_ta_hours;
      if (totalHour > currentTAHour) {
        this.toastr.error('The total hours of the course is ' + currentTAHour);
        return;
      }
      console.log(this.taHours);
      const newAllocations = this.taHours.map(th =>
        ({
          enrollment: th.enrollment,
          applicant_name: th.applicant_name,
          applicant_email: th.applicant_email,
          hour: th.hour
        }));
      const userInfo = this.userService.getCurrentUser();
      const review = {
        user: userInfo._id,
        review: TA_COURSE_STATUS.REJECT,
        course: this.courseId,
        newAllocations
      };
      this.reviewService.addReview(review).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('success accept');
          this.dialogRef.close(true);
        }
      });
    } else {
      this.toastr.error('No ta assignment');
    }
  }
}

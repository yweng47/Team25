import { Component, Inject, OnInit } from '@angular/core';
import { TAService } from '../../services/ta.service';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-instructor-ar-ta-course',
  templateUrl: './instructor-ar-ta-course.component.html',
  styleUrls: ['./instructor-ar-ta-course.component.css']
})
export class InstructorArTaCourseComponent implements OnInit {

  id = '';
  taHours = [];
  displayedColumns: string[] = ['email', 'name', 'ta_hours'];

  constructor(
    private taService: TAService,
    private reviewService: ReviewService,
    private userService: UserService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InstructorArTaCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data;
  }

  ngOnInit(): void {
    this.getTaHours();
  }

  getTaHours(): void {
    this.reviewService.getReviewById(this.id).subscribe(response => {
      if (response.code === 200) {
        this.taHours = response.data.newAllocations;
      }
    });
  }

  onCancel(): void {
    this.toastr.success('Reject success');
    this.dialogRef.close();
  }

  onOk(): void {
    this.reviewService.updateAllocation(this.taHours).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('Approve success');
        this.dialogRef.close(true);
      }
    });
  }
}

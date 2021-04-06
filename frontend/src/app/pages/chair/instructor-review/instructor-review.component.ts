import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { InstructorArTaCourseComponent } from '../../../modals/instructor-ar-ta-course/instructor-ar-ta-course.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-instructor-review',
  templateUrl: './instructor-review.component.html',
  styleUrls: ['./instructor-review.component.css']
})
export class InstructorReviewComponent implements OnInit {
  reviews = [];
  displayedColumns: string[] = ['course', 'user', 'status', 'actions'];

  constructor(
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews(): void {
    this.reviewService.getReview().subscribe(response => {
      if (response.code === 200) {
        this.reviews = response.data;
      }
    });
  }

  openCourseTaDetail(id: string): void {
    const dialogRef = this.dialog.open(InstructorArTaCourseComponent, {
      width: '500px',
      data: id
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.getReviews();
      }
    });
  }
}

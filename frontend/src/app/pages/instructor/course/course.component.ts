import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCourseComponent } from '../../../modals/edit-course/edit-course.component';
import { CourseQuestionsComponent } from '../../../modals/course-questions/course-questions.component';

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
    private userService: UserService,
    private dialog: MatDialog
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

  openEditModal(courseId: string): void {
    const dialogRef = this.dialog.open(EditCourseComponent, {
      data: courseId,
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCourses();
    });
  }

  openQuestionsModal(courseId: string): void {
    this.dialog.open(CourseQuestionsComponent, {
      data: courseId,
      width: '500px'
    });
  }
}


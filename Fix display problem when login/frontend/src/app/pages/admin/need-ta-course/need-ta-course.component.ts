import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-need-ta-course',
  templateUrl: './need-ta-course.component.html',
  styleUrls: ['./need-ta-course.component.css']
})
export class NeedTaCourseComponent implements OnInit {
  taCourses = [];
  displayedColumns: string[] = ['instructor_name', 'course_code', 'need_ta'];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTaCourses();
  }

  getTaCourses(): void {
    this.courseService.getTaCourse().subscribe(response => {
      if (response.code === 200) {
        this.taCourses = response.data;
      }
    });
  }

  changeNeedTa(taCourse: any, event): void {
    const { checked } = event;
    taCourse.need_ta = checked;
    this.courseService.updateTaCourse(taCourse).subscribe(response => {
      if (response.code !== 200) {
        this.toastr.error('update error');
      }
    });
  }
}

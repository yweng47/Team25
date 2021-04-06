import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-need-ta-course',
  templateUrl: './need-ta-course.component.html',
  styleUrls: ['./need-ta-course.component.css']
})
export class NeedTaCourseComponent implements OnInit {
  courses = [];
  taCourses = [];
  keyword = '';
  displayedColumns: string[] = ['course_code', 'section', 'component', 'need_ta'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  page = {
    pageNum: 0,
    pageSize: 10,
    totalSize: 0
  };

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.getTaCourses();
  }

  getTaCourses(): void {
    this.courseService.getTaCourse().subscribe(response => {
      if (response.code === 200) {
        this.taCourses = response.data;
      }
    });
  }

  getAllCourses(): void {
    this.courseService.getAllCourses(this.keyword, this.page.pageNum, this.page.pageSize).subscribe(response => {
      if (response.code === 200) {
        this.courses = response.data.courses;
        this.page.totalSize = response.data.totalSize;
      }
    });
  }

  changeNeedTa(course: any, event): void {
    const { checked } = event;
    const findTa = this.taCourses.find(c => c.course === course._id);
    const taCourse: any = {
      course: course._id,
      need_ta: checked,
      isNew: !findTa
    };
    if (findTa) {
      taCourse._id = findTa._id;
    }
    this.courseService.updateTaCourse(taCourse).subscribe(response => {
      if (response.code !== 200) {
        this.toastr.error('update error');
      }
      this.getTaCourses();
    });
  }

  needTA(courseId: string): boolean {
    return !!this.taCourses.find(tc => tc.course === courseId && tc.need_ta);
  }

  pageChange(event): void {
    const { pageIndex, pageSize } = event;
    this.page.pageNum = pageIndex;
    this.page.pageSize = pageSize;
    this.getAllCourses();
  }
}

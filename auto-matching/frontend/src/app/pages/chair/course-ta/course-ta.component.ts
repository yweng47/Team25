import { Component, OnInit } from '@angular/core';
import { TAService } from '../../../services/ta.service';

@Component({
  selector: 'app-course-ta',
  templateUrl: './course-ta.component.html',
  styleUrls: ['./course-ta.component.css']
})
export class CourseTaComponent implements OnInit {
  courseTAs = [];
  displayedColumns: string[] = ['course', 'user_name', 'user_email', 'ta_num', 'actions'];

  constructor(
    private taService: TAService,
  ) { }

  ngOnInit(): void {
    this.getCourseTAs();
  }

  getCourseTAs(): void {
    this.taService.getCourseTA().subscribe(response => {
      if (response.code === 200) {
        this.courseTAs = response.data;
      }
    });
  }
}

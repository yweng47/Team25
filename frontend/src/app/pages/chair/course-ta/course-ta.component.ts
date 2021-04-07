import { Component, OnInit } from '@angular/core';
import { TAService } from '../../../services/ta.service';
import * as XLSX from 'xlsx';
import { sheet2blob, startToDownload } from '../../../utils/utils';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
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

  goTAHours(courseId: string, enrolmentId: string): void {
    this.router.navigate(['../taHour/' + courseId + '/' + enrolmentId], {relativeTo: this.route});
  }
}

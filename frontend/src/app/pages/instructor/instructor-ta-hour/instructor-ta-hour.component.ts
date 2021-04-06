import { Component, OnInit } from '@angular/core';
import { TAService } from '../../../services/ta.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { sheet2blob, startToDownload } from '../../../utils/utils';

@Component({
  selector: 'app-instructor-ta-hour',
  templateUrl: './instructor-ta-hour.component.html',
  styleUrls: ['./instructor-ta-hour.component.css']
})
export class InstructorTaHourComponent implements OnInit {

  courseId = '';
  taHours = [];
  displayedColumns: string[] = ['email', 'name', 'ta_hours'];

  constructor(
    private taService: TAService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((queryParams: any) => {
      const { courseId } = queryParams.params;
      this.courseId = courseId;
      this.getTaHours();
    });
  }

  getTaHours(): void {
    this.taService.getTAHours(this.courseId).subscribe(response => {
      if (response.code === 200) {
        this.taHours = response.data;
      }
    });
  }

  download(): void {
    const taHourData = this.taHours.map(taHour => {
      const email = taHour.applicant_email;
      const name = taHour.applicant_name;
      const hour = taHour.hour;
      return [ email, name, hour ];
    });
    const wsData = [
      [ 'Applicant Email', 'Applicant Name', 'Assigned TA Hours' ],
      ...taHourData
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(wsData);
    startToDownload(sheet2blob(workSheet), 'TAHourAssigned.xlsx');
  }

}

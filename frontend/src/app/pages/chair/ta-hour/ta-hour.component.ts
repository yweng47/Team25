import { Component, OnInit } from '@angular/core';
import { TAService } from '../../../services/ta.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { sheet2blob, startToDownload } from '../../../utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { TsCourseComponent } from '../../../modals/ts-course/ts-course.component';
import { AssignTaComponent } from '../../../modals/assign-ta/assign-ta.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ta-hour',
  templateUrl: './ta-hour.component.html',
  styleUrls: ['./ta-hour.component.css']
})
export class TaHourComponent implements OnInit {
  courseId = '';
  taHours = [];
  displayedColumns: string[] = ['email', 'name', 'ta_hours', 'actions'];

  constructor(
    private taService: TAService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
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

  openTACourseModal(email: string): void {
      this.dialog.open(TsCourseComponent, {
        width: '500px',
        data: email
      });
  }

  openAssignTAModal(taHour?: any): void {
    const dialogRef = this.dialog.open(AssignTaComponent, {
      width: '500px',
      data: {
        taHour: taHour ? { ...taHour } : null,
        enrollment: this.taHours[0].enrollment
      }
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.getTaHours();
      }
    });
  }

  deleteAllocation(id: string): void {
    const result = confirm('Do you want to delete the TA hour?');
    if (result) {
      this.taService.deleteTAHour(id).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('delete ta hour success');
          this.getTaHours();
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { EnrolmentHourService } from '../../../services/enrolmentHour.service';
import { ToastrService } from 'ngx-toastr';
import { EditTaHoursComponent } from '../../../modals/edit-ta-hours/edit-ta-hours.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-enrolment-and-hour',
  templateUrl: './enrolment-and-hour.component.html',
  styleUrls: ['./enrolment-and-hour.component.css']
})
export class EnrolmentAndHourComponent implements OnInit {
  isAutoTAHours = false;
  enrolmentHours = [];
  displayedColumns: string[] = ['course', 'lab_hour', 'previous_enrollments', 'previous_ta_hours',
    'current_enrollments', 'current_ta_hours', 'actions'];

  constructor(
    private enrolmentHourService: EnrolmentHourService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getEnrollmentHours();
  }

  getEnrollmentHours(): void {
    this.enrolmentHourService.getAllEnrollmentHours().subscribe(response => {
      if (response.code) {
        this.enrolmentHours = response.data;
      }
    });
  }

  importEnrollmentHour(event): void {
    const file = event.currentTarget.files[0];
    this.isAutoTAHours = true;
    this.enrolmentHourService.importEnrollmentHours(file).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('import enrollment hours success');
        this.getEnrollmentHours();
        this.autoTAHours();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  autoTAHours(): void {
    this.enrolmentHourService.autoTAHours().subscribe(() => {
      setTimeout(() => {
        this.isAutoTAHours = false;
      }, 2000);
    });
  }

  openEditTAHoursModal(enrollment: any): void {
    const dialogRef = this.dialog.open(EditTaHoursComponent, {
      width: '500px',
      data: enrollment
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.isAutoTAHours = true;
        this.getEnrollmentHours();
        this.autoTAHours();
      }
    });
  }
}

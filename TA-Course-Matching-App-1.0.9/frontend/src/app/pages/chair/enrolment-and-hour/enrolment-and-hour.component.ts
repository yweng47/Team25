import { Component, OnInit } from '@angular/core';
import { EnrolmentHourService } from '../../../services/enrolmentHour.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrolment-and-hour',
  templateUrl: './enrolment-and-hour.component.html',
  styleUrls: ['./enrolment-and-hour.component.css']
})
export class EnrolmentAndHourComponent implements OnInit {

  enrolmentHours = [];
  displayedColumns: string[] = ['course', 'lab_hour', 'previous_enrollments', 'previous_ta_hours',
    'current_enrollments', 'current_ta_hours'];

  constructor(
    private enrolmentHourService: EnrolmentHourService,
    private toastr: ToastrService,
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
    this.enrolmentHourService.importEnrollmentHours(file).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('import enrollment hours success');
        this.getEnrollmentHours();
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}

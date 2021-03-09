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
    this.getEnrolmentHours();
  }

  getEnrolmentHours(): void {
    this.enrolmentHourService.getAllEnrolmentHours().subscribe(response => {
      if (response.code) {
        this.enrolmentHours = response.data;
      }
    });
  }

  importEnrolmentHour(event): void {
    const file = event.currentTarget.files[0];
    this.enrolmentHourService.importEnrolmentHours(file).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('import enrolment hours success');
        this.getEnrolmentHours();
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}

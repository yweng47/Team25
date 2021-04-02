import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { EnrolmentHourService } from '../../services/enrolmentHour.service';

@Component({
  selector: 'app-edit-ta-hours',
  templateUrl: './edit-ta-hours.component.html',
  styleUrls: ['./edit-ta-hours.component.css']
})
export class EditTaHoursComponent implements OnInit {
  taHours = new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]+$/)]);

  constructor(
    public dialogRef: MatDialogRef<EditTaHoursComponent>,
    private toastr: ToastrService,
    private enrolmentHourService: EnrolmentHourService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taHours.setValue(this.data.current_ta_hours);
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    if (this.taHours.valid) {
      const enrolmentHour = {
        ...this.data,
        current_ta_hours: this.taHours.value
      };
      this.enrolmentHourService.updateEnrollmentHours(enrolmentHour).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('update success');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }
}

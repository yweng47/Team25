import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TAService } from '../../services/ta.service';

@Component({
  selector: 'app-assign-ta',
  templateUrl: './assign-ta.component.html',
  styleUrls: ['./assign-ta.component.css']
})
export class AssignTaComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignTaComponent>,
    private toastr: ToastrService,
    private taService: TAService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      hour: [null, [Validators.required]],
    });
    if (this.data.taHour) {
      const { applicant_email, applicant_name, hour } = this.data.taHour;
      this.validateForm.patchValue({
        email: applicant_email,
        name: applicant_name,
        hour
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const { email, name, hour } = this.validateForm.value;
      if (this.data.taHour) {
        this.taService.updateTAHour(this.data.taHour._id, hour, this.data.enrollment).subscribe(response => {
          if (response.code === 200) {
            this.toastr.success('assign TA hour success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response.message);
          }
        });
      } else {
        this.taService.assignTAHour(name, email, hour, this.data.enrollment).subscribe(response => {
          if (response.code === 200) {
            this.toastr.success('assign TA hour success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response.message);
          }
        });
      }
    }
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  // course: any = {};
  validateForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCourseComponent>,
    private courseService: CourseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      faculty: [null, [Validators.required]],
      department: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      catalog: [null, [Validators.required]],
      section: [null, [Validators.required]],
      description: [null, [Validators.required]],
      component: [null, [Validators.required]],
      location: [null, [Validators.required]],
      mode: [null, [Validators.required]],
      _class: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      wait_tot: [null, [Validators.required]],
      current_enrolment: [null, []],
      cap_enrolment: [null, []],
      full: [null, [Validators.required]],
    });
    this.getCourse();
  }

  getCourse(): void {
    this.courseService.getCourseById(this.data).subscribe(response => {
      if (response.code === 200) {
        this.validateForm.patchValue({ ...response.data });
      }
    });
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
      console.log(this);
      this.courseService.updateCourse(this.validateForm.value).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('update course success');
          this.dialogRef.close();
        } else {
          this.toastr.error('update course error');
        }
      });
    }
  }
}

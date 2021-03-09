import { Component, Inject, OnInit } from '@angular/core';
import { TAService } from '../../services/ta.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APPLICANT_STATUS } from '../../config/applicantStatus';

@Component({
  selector: 'app-ts-course',
  templateUrl: './ts-course.component.html',
  styleUrls: ['./ts-course.component.css']
})
export class TsCourseComponent implements OnInit {
  taHours = [];
  applicantStatus = APPLICANT_STATUS;
  displayedColumns: string[] = ['course', 'ta_hours'];

  constructor(
    private taService: TAService,
    public dialogRef: MatDialogRef<TsCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    this.getTaHours();
  }

  getTaHours(): void {
    this.taService.getTAHours(null, this.data).subscribe(response => {
      if (response.code === 200) {
        this.taHours = response.data;
      }
    });
  }

  onOk(): void {
    this.dialogRef.close();
  }
}

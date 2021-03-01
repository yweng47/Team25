import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  notice = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<NoticeComponent>,
    private toastr: ToastrService,
    private noticeService: NoticeService
  ) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    if (this.notice.valid) {
      this.noticeService.createNotice(this.notice.value).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('create success');
          this.dialogRef.close();
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }

  contentChange(event): void {
    this.notice.patchValue(event.html);
  }
}

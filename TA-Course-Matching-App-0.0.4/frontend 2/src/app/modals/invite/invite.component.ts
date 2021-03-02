import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    public dialogRef: MatDialogRef<InviteComponent>,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    if (this.email.valid) {
      this.userService.inviteSignUp(this.email.value).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('invite success');
          this.dialogRef.close();
        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }
}

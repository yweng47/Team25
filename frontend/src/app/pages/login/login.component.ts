import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  notice: any = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private noticeService: NoticeService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
    this.getNotice();
  }

  getNotice(): void {
    this.noticeService.getNotice().subscribe(response => {
      if (response.data.length > 0) {
        this.notice = response.data[0];
      }
    });
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;
      this.userService.login(email, password).subscribe(response => {
        if (response.code === 200) {
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          const roles = response.data.roles;
          if (roles[0].name === 'admin') {
            this.router.navigate(['/admin']);
          } else if (roles[0].name === 'instructor') {
            this.router.navigate(['/instructor']);
          } else if (roles[0].name === 'chair') {
            this.router.navigate(['/chair']);
          } else {
            // TODO: navigate if no role
          }
        } else {
          this.toastr.error('invalid email or password');
        }
      });
    }
  }
}

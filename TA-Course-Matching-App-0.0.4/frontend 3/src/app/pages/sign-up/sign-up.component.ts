import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  validateForm!: FormGroup;
  courseNum = 1;
  user = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private courseService: CourseService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
      course1: [null],
      course2: [null],
    });
    this.route.queryParams.subscribe(queryParams => {
     const accessToken = queryParams.access_token;
     if (!accessToken) {
       this.router.navigate(['/login']);
     } else {
       this.userService.checkToken(accessToken).subscribe(response => {
         if (response.code === 200) {
           this.user = response.data;
         } else {
           this.toastr.warning('invalid access token');
           this.router.navigate(['/login']);
         }
       });
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
      const { email, password, name, course1, course2 } = this.validateForm.value;
      this.courseService.getCourseByCode(course1).subscribe(courseResp1 => {
        if (courseResp1.code === 200) {
          const relateCourses = [courseResp1.data._id];
          if (course2) {
            this.courseService.getCourseByCode(course2).subscribe(courseResp2 => {
              if (courseResp2.code === 200) {
                relateCourses.push(courseResp2.data._id);
                this.userService.signUp(email, password, name, relateCourses).subscribe(response => {
                  if (response.code === 200) {
                    this.toastr.success('sign up success');
                  }
                });
              } else {
                this.toastr.warning('invalid course code');
              }
            });
          } else {
            this.userService.signUp(email, password, name, relateCourses).subscribe(response => {
              if (response.code === 200) {
                this.toastr.success('sign up success');
              }
            });
          }
        } else {
          this.toastr.warning('invalid course code');
        }
      });
    }
  }
}

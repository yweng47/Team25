import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ROLE } from '../../../config/role';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  instructors: User[] = [];
  displayedColumns: string[] = ['email', 'name', 'relate_courses', 'actions'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getInstructors();
  }

  getInstructors(): void {
    this.userService.getUsers(ROLE.INSTRUCTOR).subscribe(response => {
      if (response.code === 200) {
        this.instructors = response.data;
      }
    });
  }

  invite(instructor): void {
    const { _id, email } = instructor;
    this.userService.inviteSignUp(_id, email).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('invite success');
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}

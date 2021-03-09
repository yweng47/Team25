import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ROLE } from '../../../config/role';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { InviteComponent } from '../../../modals/invite/invite.component';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  instructors: User[] = [];
  displayedColumns: string[] = ['email', 'name', 'relate_courses'];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog
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
    this.userService.inviteSignUp(email).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('invite success');
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  openInviteModal(perform?: any): void {
    const dialogRef = this.dialog.open(InviteComponent, {
      width: '500px',
      data: perform
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
      }
    });
  }

  getCourseNames(courses): string {
    return courses.map(course => course.subject + course.catalog).join(',');
  }
}

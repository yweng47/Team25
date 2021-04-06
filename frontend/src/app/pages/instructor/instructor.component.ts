import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROLE } from '../../config/role';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {

  showFiller = false;
  userInfo: any = {};

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {
    this.userInfo = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.userService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  isChair(): boolean {
    if (this.userInfo.roles && this.userInfo.roles.length > 0) {
      const roleNames = this.userInfo.roles.map(role => role.name);
      return roleNames.includes(ROLE.CHAIR);
    }
    return false;
  }

  toChairPage(): void {
    this.router.navigate(['/chair']);
  }
}

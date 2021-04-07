import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROLE } from '../../config/role';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chair',
  templateUrl: './chair.component.html',
  styleUrls: ['./chair.component.css']
})
export class ChairComponent implements OnInit {

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

  isInstructor(): boolean {
    if (this.userInfo.roles && this.userInfo.roles.length > 0) {
      const roleNames = this.userInfo.roles.map(role => role.name);
      return roleNames.includes(ROLE.INSTRUCTOR);
    }
    return false;
  }

  logout(): void {
    this.userService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  toInstructorPage(): void {
    this.router.navigate(['/instructor']);
  }
}

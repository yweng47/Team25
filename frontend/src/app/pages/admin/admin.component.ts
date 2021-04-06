import { Component, OnInit } from '@angular/core';
import { InviteComponent } from '../../modals/invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { NoticeComponent } from '../../modals/notice/notice.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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

  openInviteModal(): void {
    this.dialog.open(NoticeComponent, {
      width: '800px'
    });
  }

  logout(): void {
    this.userService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}

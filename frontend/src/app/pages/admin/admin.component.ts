import { Component, OnInit } from '@angular/core';
import { InviteComponent } from '../../modals/invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { NoticeComponent } from '../../modals/notice/notice.component';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userInfo = JSON.parse(currentUser);
    }
  }

  ngOnInit(): void {
  }

  openInviteModal(): void {
    this.dialog.open(NoticeComponent, {
      width: '500px'
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}

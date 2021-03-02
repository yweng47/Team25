import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userInfo = JSON.parse(currentUser);
    }
  }

  ngOnInit(): void {
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}

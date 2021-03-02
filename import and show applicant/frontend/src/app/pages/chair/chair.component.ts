import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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

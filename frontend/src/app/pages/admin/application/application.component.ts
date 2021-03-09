import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applications = [];
  displayedColumns: string[] = ['course', 'user_name', 'user_email', 'preference' , 'answer_num', 'status'];

  constructor(
    private applicationService: ApplicationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications(): void {
    this.applicationService.getAllApplications().subscribe(response => {
      if (response.code === 200) {
        this.applications = response.data;
      }
    });
  }

  importApplication(event): void {
    const file = event.currentTarget.files[0];
    this.applicationService.importApplications(file).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('import application success');
        this.getApplications();
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { PreferenceService } from '../../../services/preference.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  preferences = [];
  displayedColumns: string[] = ['user_name', 'user_email', 'first_choice' , 'second_choice'];

  constructor(
    private preferenceService: PreferenceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getPreferences();
  }

  getPreferences(): void {
    this.preferenceService.getAllPreferences().subscribe(response => {
      if (response.code === 200) {
        this.preferences = response.data;
      }
    });
  }

  importPreference(event): void {
    const file = event.currentTarget.files[0];
    this.preferenceService.importPreferences(file).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('import preference success');
        this.getPreferences();
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}

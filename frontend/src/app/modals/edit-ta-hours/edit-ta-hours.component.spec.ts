import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaHoursComponent } from './edit-ta-hours.component';

describe('EditTaHoursComponent', () => {
  let component: EditTaHoursComponent;
  let fixture: ComponentFixture<EditTaHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTaHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

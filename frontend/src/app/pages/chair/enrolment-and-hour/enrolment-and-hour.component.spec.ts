import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentAndHourComponent } from './enrolment-and-hour.component';

describe('EnrolmentAndHourComponent', () => {
  let component: EnrolmentAndHourComponent;
  let fixture: ComponentFixture<EnrolmentAndHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentAndHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentAndHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorTaHourComponent } from './instructor-ta-hour.component';

describe('InstructorTaHourComponent', () => {
  let component: InstructorTaHourComponent;
  let fixture: ComponentFixture<InstructorTaHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorTaHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorTaHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

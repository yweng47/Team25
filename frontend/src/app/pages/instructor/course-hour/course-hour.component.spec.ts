import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHourComponent } from './course-hour.component';

describe('CourseHourComponent', () => {
  let component: CourseHourComponent;
  let fixture: ComponentFixture<CourseHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

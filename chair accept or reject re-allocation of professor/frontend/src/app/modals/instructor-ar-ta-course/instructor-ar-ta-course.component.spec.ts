import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorArTaCourseComponent } from './instructor-ar-ta-course.component';

describe('InstructorArTaCourseComponent', () => {
  let component: InstructorArTaCourseComponent;
  let fixture: ComponentFixture<InstructorArTaCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorArTaCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorArTaCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

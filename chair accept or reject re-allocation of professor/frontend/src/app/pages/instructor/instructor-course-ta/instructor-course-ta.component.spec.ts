import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseTaComponent } from './instructor-course-ta.component';

describe('InstructorCourseTaComponent', () => {
  let component: InstructorCourseTaComponent;
  let fixture: ComponentFixture<InstructorCourseTaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorCourseTaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseTaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

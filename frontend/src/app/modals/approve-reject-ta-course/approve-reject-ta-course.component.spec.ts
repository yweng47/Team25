import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectTaCourseComponent } from './approve-reject-ta-course.component';

describe('ApproveRejectTaCourseComponent', () => {
  let component: ApproveRejectTaCourseComponent;
  let fixture: ComponentFixture<ApproveRejectTaCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectTaCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectTaCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

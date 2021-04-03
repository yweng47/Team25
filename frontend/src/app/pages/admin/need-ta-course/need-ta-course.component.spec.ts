import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedTaCourseComponent } from './need-ta-course.component';

describe('NeedTaCourseComponent', () => {
  let component: NeedTaCourseComponent;
  let fixture: ComponentFixture<NeedTaCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeedTaCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedTaCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

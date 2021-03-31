import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsCourseComponent } from './ts-course.component';

describe('TsCourseComponent', () => {
  let component: TsCourseComponent;
  let fixture: ComponentFixture<TsCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsCourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

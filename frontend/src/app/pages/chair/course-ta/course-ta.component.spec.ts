import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTaComponent } from './course-ta.component';

describe('CourseTaComponent', () => {
  let component: CourseTaComponent;
  let fixture: ComponentFixture<CourseTaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseTaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaHourComponent } from './ta-hour.component';

describe('TaHourComponent', () => {
  let component: TaHourComponent;
  let fixture: ComponentFixture<TaHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOfDayComponent } from './deal-of-day.component';

describe('DealOfDayComponent', () => {
  let component: DealOfDayComponent;
  let fixture: ComponentFixture<DealOfDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealOfDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

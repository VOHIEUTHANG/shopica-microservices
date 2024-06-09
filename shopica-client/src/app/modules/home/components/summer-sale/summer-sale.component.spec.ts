import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerSaleComponent } from './summer-sale.component';

describe('SummerSaleComponent', () => {
  let component: SummerSaleComponent;
  let fixture: ComponentFixture<SummerSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummerSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummerSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

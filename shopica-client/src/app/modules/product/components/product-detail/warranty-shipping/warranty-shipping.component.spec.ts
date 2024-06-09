import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyShippingComponent } from './warranty-shipping.component';

describe('WarrantyShippingComponent', () => {
  let component: WarrantyShippingComponent;
  let fixture: ComponentFixture<WarrantyShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarrantyShippingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

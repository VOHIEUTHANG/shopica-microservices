import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodModalComponent } from './payment-method-modal.component';

describe('PaymentMethodModalComponent', () => {
  let component: PaymentMethodModalComponent;
  let fixture: ComponentFixture<PaymentMethodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentMethodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

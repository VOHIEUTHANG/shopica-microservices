import { TestBed } from '@angular/core/testing';

import { LeaveCheckoutPageGuard } from './leave-checkout-page.guard';

describe('LeaveCheckoutPageGuard', () => {
  let guard: LeaveCheckoutPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LeaveCheckoutPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

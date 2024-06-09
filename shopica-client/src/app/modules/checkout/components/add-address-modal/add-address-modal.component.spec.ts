import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressModalComponent } from './add-address-modal.component';

describe('AddAddressModalComponent', () => {
  let component: AddAddressModalComponent;
  let fixture: ComponentFixture<AddAddressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAddressModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

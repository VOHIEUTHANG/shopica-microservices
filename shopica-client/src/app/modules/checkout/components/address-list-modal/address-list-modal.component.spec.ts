import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressListModalComponent } from './address-list-modal.component';

describe('AddressListModalComponent', () => {
  let component: AddressListModalComponent;
  let fixture: ComponentFixture<AddressListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

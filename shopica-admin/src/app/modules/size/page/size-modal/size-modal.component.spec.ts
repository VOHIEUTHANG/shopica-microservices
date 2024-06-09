import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeModalComponent } from './size-modal.component';

describe('SizeModalComponent', () => {
  let component: SizeModalComponent;
  let fixture: ComponentFixture<SizeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

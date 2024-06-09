import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDrawerComponent } from './reset-password-drawer.component';

describe('ResetPasswordDrawerComponent', () => {
  let component: ResetPasswordDrawerComponent;
  let fixture: ComponentFixture<ResetPasswordDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

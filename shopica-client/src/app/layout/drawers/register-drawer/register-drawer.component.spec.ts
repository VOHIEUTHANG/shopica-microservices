import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDrawerComponent } from './register-drawer.component';

describe('RegisterDrawerComponent', () => {
  let component: RegisterDrawerComponent;
  let fixture: ComponentFixture<RegisterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeListComponent } from './size-list.component';

describe('SizeListComponent', () => {
  let component: SizeListComponent;
  let fixture: ComponentFixture<SizeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

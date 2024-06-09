import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickShopComponent } from './quick-shop.component';

describe('QuickShopComponent', () => {
  let component: QuickShopComponent;
  let fixture: ComponentFixture<QuickShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

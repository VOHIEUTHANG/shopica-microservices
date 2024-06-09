import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartDrawerComponent } from './shopping-cart-drawer.component';

describe('ShoppingCartDrawerComponent', () => {
  let component: ShoppingCartDrawerComponent;
  let fixture: ComponentFixture<ShoppingCartDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

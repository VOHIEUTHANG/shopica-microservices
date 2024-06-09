import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBestSellerComponent } from './product-top.component';

describe('ProductBestSellerComponent', () => {
  let component: ProductBestSellerComponent;
  let fixture: ComponentFixture<ProductBestSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductBestSellerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBestSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

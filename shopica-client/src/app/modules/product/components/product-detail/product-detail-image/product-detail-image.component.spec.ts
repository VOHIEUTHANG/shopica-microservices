import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailImageComponent } from './product-detail-image.component';

describe('ProductDetailImageComponent', () => {
  let component: ProductDetailImageComponent;
  let fixture: ComponentFixture<ProductDetailImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

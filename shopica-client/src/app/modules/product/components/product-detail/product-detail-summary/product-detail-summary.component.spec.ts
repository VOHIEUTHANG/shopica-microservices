import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailSummaryComponent } from './product-detail-summary.component';

describe('ProductDetailSummaryComponent', () => {
  let component: ProductDetailSummaryComponent;
  let fixture: ComponentFixture<ProductDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTrendingComponent } from './product-trending.component';

describe('ProductTrendingComponent', () => {
  let component: ProductTrendingComponent;
  let fixture: ComponentFixture<ProductTrendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTrendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

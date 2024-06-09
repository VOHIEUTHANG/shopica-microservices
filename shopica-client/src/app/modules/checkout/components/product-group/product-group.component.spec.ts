import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupComponent } from './product-group.component';

describe('ProductGroupComponent', () => {
  let component: ProductGroupComponent;
  let fixture: ComponentFixture<ProductGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

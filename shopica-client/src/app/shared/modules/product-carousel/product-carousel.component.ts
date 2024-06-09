import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '@core/model/product/product';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent implements OnInit {

  @Input() listProduct: Product[];
  @Input() carouselOptions: OwlOptions;

  constructor() { }

  ngOnInit(): void {
  }

}

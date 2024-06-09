import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ProductOptions } from './../../../../core/model/product/product-option';
import { ProductService } from './../../../../core/services/product/product.service';
import { BaseParams } from './../../../../core/model/base-params';
import { Product } from '../../../../core/model/product/product';
import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() productCol = 6;
  @Input() listProduct: Product[] = [];
  constructor() { }

  ngOnInit(): void {

  }
}

import { ProductSort } from './product-sort';
export class ProductOptions {
  categoryNames: string[];
  productNames: string;
  colorNames: string[];
  sizeNames: string[];
  brandNames: string[];
  prices: number[];
  sortType: ProductSort;
  constructor() {
    this.brandNames = [];
    this.sizeNames = [];
    this.colorNames = [];
    this.prices = [];
    this.categoryNames = null;
    this.productNames = null;
  }
}

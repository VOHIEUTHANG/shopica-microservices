import { ProductImage } from './product-image';
import { ProductColor } from './product-color';
import { ProductSize } from './product-size';
export interface Product {
  productName: string;
  id?: number;
  price: number;
  categoryId: number;
  categoryName?: string;
  brandId: number;
  brandName?: string;
  tags: string[];
  productColors: ProductColor[];
  productSizes: ProductSize[];
  productImages: ProductImage[];
}

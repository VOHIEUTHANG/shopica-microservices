import { Color } from '@core/model/color/color';
import { Size } from '@core/model/size/size';
import { ProductDetail } from '@core/model/product/product-detail';
export function getListSize(productDetails: ProductDetail[]): Size[] {
  const distinctSizes = new Set<string>();
  productDetails.forEach(element => {
    const size: Size = {
      id: element.sizeId,
      sizeName: element.size,
    };
    distinctSizes.add(JSON.stringify(size));
  });

  return [...distinctSizes].map(x => JSON.parse(x));
}

export function getListColor(productDetails: ProductDetail[]): Color[] {
  const distinctColors = new Set<string>();
  productDetails.forEach(element => {
    const color: Color = {
      id: element.colorId,
      colorName: element.color,
      colorCode: element.colorHex
    };
    distinctColors.add(JSON.stringify(color));
  });

  return [...distinctColors].map(x => JSON.parse(x));
}

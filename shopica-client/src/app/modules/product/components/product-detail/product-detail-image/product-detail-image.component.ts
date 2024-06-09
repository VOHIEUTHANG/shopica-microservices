import { ProductImage } from './../../../../../core/model/product/product-image';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, Input, OnInit } from '@angular/core';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-product-detail-image',
  templateUrl: './product-detail-image.component.html',
  styleUrls: ['./product-detail-image.component.css']
})
export class ProductDetailImageComponent implements OnInit {
  constructor(private nzImageService: NzImageService) { }

  @Input() listImage: ProductImage[] = [];
  listImageZoom: NzImage[] = [];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    dots: true,
    dotsData: true,
    skip_validateItems: true,
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true,
    navText: ['<', '>']
  };

  ngOnInit(): void {
  }

  enLargeImage() {
    this.listImage.forEach(x => {
      this.listImageZoom.push({
        src: x.imageUrl,
        height: '700px',
      });
    });
    this.nzImageService.preview(this.listImageZoom, { nzZoom: 1, nzRotate: 0 });
  }
}

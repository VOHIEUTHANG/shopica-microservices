import { AuthService } from '@core/services/auth/auth.service';
import { ShareService } from './../../../../core/services/share/share.service';
import { LoaderService } from './../../../../shared/modules/loader/loader.service';
import { finalize } from 'rxjs/operators';
import { ProductService } from './../../../../core/services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../../../../core/model/product/product';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '@core/services/comment/comment.service';
import { BaseParams } from '@core/model/base-params';
import { Comment, CommentDocumentType } from '@core/model/comment/comment';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@env';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productId: number;
  product: Product;

  listProduct: Product[] = [];
  comments: Comment[] = [];
  ratingAverage: number;

  customOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    skip_validateItems: true,
    responsive: {
      200: {
        items: 1
      },
      300: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 4
      }

    },
    nav: true,
    navText: ['<', '>']
  };
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly loaderService: LoaderService,
    private readonly authService: AuthService,
    private readonly commentService: CommentService,
    private readonly storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(pa => {
      this.productId = pa.productId;
      this.loaderService.showLoader('productDetail');
      this.productService.getProductById(this.productId).pipe(
        finalize(() => this.loaderService.hideLoader('productDetail'))
      ).subscribe(res => {
        if (res.isSuccess) {
          this.product = res.data;
          this.product.productImages.forEach(pi => {
            pi.imageUrl = encodeURI(pi.imageUrl);
          });
        }
      });
    });

    if (this.authService.isAuthenticated()) {
      // this.productService.getProductRecommender().subscribe(res => {
      //   this.listProduct = res;
      // })
    }
    else {
      // this.productService.getProductBestSellerByStore().subscribe(res => {
      //   this.listProduct = res.data;
      // })
    }

    this.getRecentlyProduct();

    this.commentService.getAllComment(new BaseParams(1, 50), CommentDocumentType.Product.toString(), this.productId)
      .subscribe(res => {
        if (res.isSuccess) {
          this.comments = res.data.data;
          this.ratingAverage = this.comments.length == 0 ? 0 :
            Math.round(this.comments.map(c => c.rate).reduce((prev, cur) => prev + cur) / this.comments.length * 100) / 100;
        }
      })

  }

  getRecentlyProduct() {
    let productIds = this.storageService.getValue<number[]>(environment.recentlyViewedProductKey);
    if (productIds == null) {
      productIds = [this.productId];
    }
    else {
      const index = productIds.indexOf(this.productId);
      if (index !== -1) {
        productIds = productIds.filter(p => p !== this.productId);
        productIds = [...productIds, this.productId];
      }
      else {
        productIds = [...productIds, this.productId];
      }
    }

    if (productIds.length > 4) {
      productIds.shift();
    }

    this.storageService.setObject(environment.recentlyViewedProductKey, productIds);
    const productIddStr = productIds.join(',');
    this.productService.getProductByIds(productIddStr).subscribe(res => {
      if (res.isSuccess) {
        this.listProduct = res.data;
      }
    });

  }
}

import { LoaderModule } from './../../shared/modules/loader/loader.module';
import { LoaderComponent } from './../../shared/modules/loader/loader.component';
import { SharedModule } from './../../shared/shared.module';
import { HeaderPageModule } from './../../shared/modules/header-page/header-page.module';
import { TabModule } from './../../shared/modules/tab/tab.module';
import { ProductCarouselModule } from './../../shared/modules/product-carousel/product-carousel.module';
import { SectionTitleModule } from './../../shared/modules/section-title/section-title.module';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { CartItemModule } from './../../shared/modules/cart-item/cart-item.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductCardModule } from './../../shared/modules/product-card/product-card.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { shareIcons } from './../../shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { productRoutes } from './product.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories/categories.component';
import { ToolbarsComponent } from './components/toolbars/toolbars.component';
import { ProductComponent } from './page/product/product.component';
import { FilterDrawerComponent } from './components/filter-drawer/filter-drawer.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ContentComponent } from './components/content/content.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { ProductDetailImageComponent } from './components/product-detail/product-detail-image/product-detail-image.component';
import { ProductDetailSummaryComponent } from './components/product-detail/product-detail-summary/product-detail-summary.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { WarrantyShippingComponent } from './components/product-detail/warranty-shipping/warranty-shipping.component';
import { DescriptionComponent } from './components/product-detail/description/description.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { WishListComponent } from './page/wish-list/wish-list.component';
import { CommentsModule } from '@shared/modules/comments/comments.module';
@NgModule({
  declarations: [
    CategoriesComponent,
    ToolbarsComponent,
    ProductComponent,
    FilterDrawerComponent,
    ContentComponent,
    ProductDetailComponent,
    ProductDetailImageComponent,
    ProductDetailSummaryComponent,
    WarrantyShippingComponent,
    DescriptionComponent,
    WishListComponent
  ],
  imports: [
    CommonModule,
    NzSelectModule,
    NzGridModule,
    NzDrawerModule,
    NzPaginationModule,
    NzRateModule,
    NzToolTipModule,
    NzButtonModule,
    NzImageModule,
    NzCommentModule,
    NzAvatarModule,
    FormsModule,
    LoaderModule,
    CommentsModule,
    ProductCarouselModule,
    ProductCardModule,
    CartItemModule,
    TabModule,
    SectionTitleModule,
    HeaderPageModule,

    CarouselModule,
    NzIconModule.forChild(shareIcons),
    RouterModule.forChild(productRoutes)
  ]
})
export class ProductModule { }

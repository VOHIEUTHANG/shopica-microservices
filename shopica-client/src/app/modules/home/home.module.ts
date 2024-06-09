import { ProductCarouselModule } from './../../shared/modules/product-carousel/product-carousel.module';
import { BlogCardModule } from './../../shared/modules/blog-card/blog-card.module';
import { CartItemModule } from './../../shared/modules/cart-item/cart-item.module';
import { SectionTitleModule } from './../../shared/modules/section-title/section-title.module';
import { TabModule } from './../../shared/modules/tab/tab.module';
import { ProductTrendingComponent } from './components/product-trending/product-trending.component';
import { shareIcons } from './../../shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductCardModule } from './../../shared/modules/product-card/product-card.module';
import { homeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductBestSellerComponent } from './components/product-top/product-top.component';
import { BannerComponent } from './components/banner/banner.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CategoryCardModule } from '@shared/modules/category-card/category-card.module';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { DealOfDayComponent } from './components/deal-of-day/deal-of-day.component';
import { SummerSaleComponent } from './components/summer-sale/summer-sale.component';

@NgModule({
  declarations: [
    HomeComponent,
    CategoryListComponent,
    ProductBestSellerComponent,
    ProductTrendingComponent,
    BannerComponent,
    BlogListComponent,
    ShippingComponent,
    DealOfDayComponent,
    SummerSaleComponent
  ],
  imports: [
    CommonModule,

    // nz modules
    NzCarouselModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule.forRoot(shareIcons),

    // custom modules
    TabModule,
    SectionTitleModule,
    CartItemModule,
    CategoryCardModule,
    BlogCardModule,
    ProductCarouselModule,

    // carousel
    CarouselModule,
    RouterModule.forChild(homeRoutes)
  ]
})
export class HomeModule { }

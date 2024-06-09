import { Price } from './../../../../core/model/product/price';
import { Router, ActivatedRoute } from '@angular/router';
import { ColorService } from './../../../../core/services/color/color.service';
import { Brand } from '../../../../core/model/brand/brand';
import { Size } from '@core/model/size/size';
import { Color } from '../../../../core/model/color/color';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrandService } from '@core/services/brand/brand.service';
import { SizeService } from '@core/services/size/size.service';
import { BaseParams } from '@core/model/base-params';

@Component({
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.css']
})
export class FilterDrawerComponent implements OnInit {

  @Input() isShowFilter = false;
  @Output() closeFilterEvent = new EventEmitter<boolean>();
  baseParams: BaseParams = new BaseParams(1, 10);

  listColor: Color[] = [];

  listSize: Size[] = [];

  listBrand: Brand[] = [];

  listPrice: Price[] = [
    {
      priceName: '$7 - $50',
      priceUrl: '7-50',
    },
    {
      priceName: '$51 - $100',
      priceUrl: '51-100',
    },
    {
      priceName: '$100 - $500',
      priceUrl: '100-500',
    },
    {
      priceName: '$501 - $1000',
      priceUrl: '501-1000',
    },
    {
      priceName: '$1001 - $3000',
      priceUrl: '1001-3000',
    },
  ];

  selectedColor: string[] = [];
  selectedSize: string[] = [];
  selectedBrand: string[] = [];
  selectedPrice: string[] = [];
  currentCategory: string;

  constructor(
    private readonly brandService: BrandService,
    private readonly colorService: ColorService,
    private readonly sizeService: SizeService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAllBrand();
    this.loadAllColor();
    this.loadAllSize();

    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedColor = params.color !== undefined ? (params.color as string).split(',') : [];

      this.selectedSize = params.size !== undefined ? (params.size as string).split(',') : [];

      this.selectedBrand = params.brand !== undefined ? (params.brand as string).split(',') : [];

      this.selectedPrice = params.price !== undefined ? (params.price as string).split(',') : [];
    });

    this.activatedRoute.params.subscribe((data) => {
      this.currentCategory = data.category;
    });
  }

  closeMenu() {
    this.closeFilterEvent.emit();
  }

  loadAllBrand() {
    this.brandService.getAllBrand(this.baseParams).subscribe((res) => {
      if (res.isSuccess) {
        this.listBrand = res.data.data;
      }
    });
  }


  loadAllSize() {
    this.sizeService.getAllSize(this.baseParams).subscribe((res) => {
      if (res.isSuccess) {
        this.listSize = res.data.data;
      }
    });
  }


  loadAllColor() {
    this.colorService.getAllColor(this.baseParams).subscribe((res) => {
      if (res.isSuccess) {
        this.listColor = res.data.data;
      }
    });
  }

  selectColor(color: Color) {
    this.closeMenu();
    if (this.selectedColor.indexOf(color.colorName.toLowerCase()) !== -1) {
      this.selectedColor = this.selectedColor.filter(c => c !== color.colorName.toLowerCase());
    }
    else {
      this.selectedColor = [...this.selectedColor, color.colorName.toLowerCase()];
    }

    this.router.navigate(['/product/collection', this.currentCategory],
      {
        queryParams: {
          color: this.selectedColor.length > 0 ? this.selectedColor.join(',') : null
        },
        queryParamsHandling: 'merge',
      });
  }

  selectSize(size: Size) {
    this.closeMenu();
    if (this.selectedSize.indexOf(size.sizeName.toLowerCase()) !== -1) {
      this.selectedSize = this.selectedSize.filter(c => c !== size.sizeName.toLowerCase());
    }
    else {
      this.selectedSize = [...this.selectedSize, size.sizeName.toLowerCase()];
    }

    this.router.navigate(['/product/collection', this.currentCategory],
      {
        queryParams: {
          size: this.selectedSize.length > 0 ? this.selectedSize.join(',') : null
        },
        queryParamsHandling: 'merge'
      });
  }

  selectBrand(brand: Brand) {
    this.closeMenu();
    if (this.selectedBrand.indexOf(brand.brandName.toLowerCase()) !== -1) {
      this.selectedBrand = this.selectedBrand.filter(c => c !== brand.brandName.toLowerCase());
    }
    else {
      this.selectedBrand = [...this.selectedBrand, brand.brandName.toLowerCase()];
    }
    this.router.navigate(['/product/collection', this.currentCategory],
      {
        queryParams: {
          brand: this.selectedBrand.length > 0 ? this.selectedBrand.join(',') : null
        },
        queryParamsHandling: 'merge'
      });
  }

  selectPrice(price: Price) {
    if (this.selectedPrice.indexOf(price.priceUrl.toLowerCase()) !== -1) {
      this.selectedPrice = this.selectedPrice.filter(c => c !== price.priceUrl.toLowerCase());
    }
    else {
      this.selectedPrice = [...this.selectedPrice, price.priceUrl.toLowerCase()];
    }
    this.closeMenu();
    this.router.navigate(['/product/collection', this.currentCategory],
      {
        queryParams: {
          price: this.selectedPrice.length > 0 ? this.selectedPrice.join(',') : null
        }, queryParamsHandling: 'merge'
      });
  }
}

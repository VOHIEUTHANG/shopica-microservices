import { PromotionService } from '../../services/promotion.service';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Promotion, PromotionType } from '@app/modules/promotion/model/promotion';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { Product } from '@app/modules/product/model/product';
import { ProductService } from '@app/modules/product/services/product.service';
import { BaseParams } from '@app/modules/common/base-params';

@Component({
  selector: 'app-promotion-card',
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.css']
})
export class PromotionCardComponent implements OnInit {

  @Input() isVisible = false;
  @Input() modalTitle = "Add promotion";
  @Input() promotionObject: Promotion;
  @Output() cancelModalEvent = new EventEmitter<string>();
  @Output() okModalEvent = new EventEmitter<Promotion>();
  baseForm: FormGroup;
  isLoadingButton: boolean;
  promotionCode: string = '';
  public PromotionTypes = PromotionType;
  public promotionTypes = Object.values(PromotionType).filter(value => typeof value === 'number');
  editMode: boolean;
  listProduct: Product[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly promotionService: PromotionService,
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly router: Router) {
  }

  ngOnInit(): void {

    this.buildForm();

    //edit mode
    this.activatedRoute.params.subscribe(params => {
      if (params.promotionCode) {
        this.editMode = true;
        this.promotionCode = params.promotionCode
        this.loadPromotion(this.promotionCode);
      }
    });

    this.productService.getAll(new BaseParams(1, 50)).pipe(
    ).subscribe(response => {
      if (response.isSuccess) {
        this.listProduct = response.data.data;
      }
    });
  }


  loadPromotion(promotionCode: string) {
    this.isLoadingButton = true;
    this.promotionService.getById(promotionCode).pipe(
      finalize(() => this.isLoadingButton = false)
    )
      .subscribe(res => {
        if (res.isSuccess) {
          const promotion = res.data;
          this.baseForm.setValue({
            code: promotion.code,
            type: promotion.type,
            description: promotion.description,
            date: [promotion.startDate, promotion.endDate],
            salesById: promotion.salesById,
            salesByQuantity: promotion.salesByQuantity,
            salesByName: promotion.salesByName,
            salesByAmount: promotion.salesByAmount,
            promotionById: promotion.promotionById,
            promotionQuantity: promotion.promotionQuantity,
            promotionByName: promotion.promotionByName,
            promotionColorName: promotion.promotionColorName,
            promotionColorId: promotion.promotionColorId,
            promotionSizeName: promotion.promotionSizeName,
            promotionSizeId: promotion.promotionSizeId,
            promotionImageUrl: promotion.promotionImageUrl,
            promotionPrice: promotion.promotionPrice,
            promotionAmount: promotion.promotionAmount,
            promotionDiscount: promotion.promotionDiscount,
            promotionDiscountLimit: promotion.promotionDiscountLimit,
            active: promotion.active,
          });

          this.baseForm.controls['code'].disable();
          this.baseForm.controls['type'].disable();
        }
      });
  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      code: [null, [Validators.required]],
      type: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date: [null, [Validators.required]],
      salesById: [null, []],
      salesByQuantity: [null, []],
      salesByName: [null, []],
      salesByAmount: [null, []],
      promotionById: [null, []],
      promotionQuantity: [null, []],
      promotionByName: [null, []],
      promotionColorName: [null, []],
      promotionColorId: [null, []],
      promotionSizeName: [null, []],
      promotionSizeId: [null, []],
      promotionImageUrl: [null, []],
      promotionPrice: [null, []],
      promotionAmount: [null, []],
      promotionDiscount: [null, []],
      promotionDiscountLimit: [null, []],
      active: [null, [Validators.required]],
    })
  }



  submitForm() {

    this.isLoadingButton = true;
    let promotion: Promotion = {
      type: this.baseForm.controls['type'].value,
      code: this.baseForm.controls['code'].value,
      description: this.baseForm.controls['description'].value,
      startDate: this.baseForm.controls['date'].value[0],
      endDate: this.baseForm.controls['date'].value[1],
      active: this.baseForm.controls['active'].value,
      salesById: this.baseForm.controls['salesById'].value ?? 0,
      salesByName: this.baseForm.controls['salesByName'].value ?? '',
      salesByQuantity: this.baseForm.controls['salesByQuantity'].value ?? 0,
      salesByAmount: this.baseForm.controls['salesByAmount'].value ?? 0,
      promotionAmount: this.baseForm.controls['promotionAmount'].value ?? 0,
      promotionById: this.baseForm.controls['promotionById'].value ?? 0,
      promotionByName: this.baseForm.controls['promotionByName'].value ?? '',
      promotionColorName: this.baseForm.controls['promotionColorName'].value ?? '',
      promotionColorId: this.baseForm.controls['promotionColorId'].value ?? 0,
      promotionSizeName: this.baseForm.controls['promotionSizeName'].value ?? '',
      promotionSizeId: this.baseForm.controls['promotionSizeId'].value ?? 0,
      promotionImageUrl: this.baseForm.controls['promotionImageUrl'].value ?? '',
      promotionPrice: this.baseForm.controls['promotionPrice'].value ?? 0,
      promotionQuantity: this.baseForm.controls['promotionQuantity'].value ?? 0,
      promotionDiscount: this.baseForm.controls['promotionDiscount'].value ?? 0,
      promotionDiscountLimit: this.baseForm.controls['promotionDiscountLimit'].value ?? 0,
    }

    if (this.editMode) {
      this.updatePromotion(promotion);
    }
    else {
      this.insertPromotion(promotion);
    }
  }


  insertPromotion(promotion: Promotion) {
    this.promotionService.create(promotion).pipe(
      finalize(() => this.isLoadingButton = false)).subscribe(
        res => {
          if (res.isSuccess) {
            this.messageService.success("Create promotion successful!");
            this.router.navigate(['/admin/promotion']);
          }
          else {
            this.messageService.error(res.errorMessage);
          }
        }
      )
  }

  updatePromotion(promotion: Promotion) {
    this.promotionService.update(promotion).pipe(
      finalize(() => this.isLoadingButton = false)).subscribe(
        res => {
          if (res.isSuccess) {
            this.messageService.success("Update promotion successful!");
            this.router.navigate(['/admin/promotion']);
          }
          else {
            this.messageService.error(res.errorMessage);
          }
        }
      )
  }

  generateCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.baseForm.controls.code.setValue(result);
  }


  promotionTypeChange(type: PromotionType) {
    const productPromotionFields = ['salesById', 'salesByQuantity', 'promotionById', 'promotionQuantity'];
    const amountPromotionFields = ['salesByAmount', 'promotionAmount'];
    const discountPromotionFields = ['salesByAmount', 'promotionDiscount', 'promotionDiscountLimit'];

    switch (type) {
      case PromotionType.Product:
        productPromotionFields.forEach(key => {
          this.enableFormControl(key);
        })

        amountPromotionFields.concat(discountPromotionFields).forEach(key => {
          this.disableFormControl(key);
        })
        break;
      case PromotionType.Amount:
        productPromotionFields.concat(discountPromotionFields).forEach(key => {
          this.disableFormControl(key);
        })

        amountPromotionFields.forEach(key => {
          this.enableFormControl(key);
        })
        break;
      case PromotionType.Discount:
        amountPromotionFields.concat(productPromotionFields).forEach(key => {
          this.disableFormControl(key);
        });
        discountPromotionFields.forEach(key => {
          this.enableFormControl(key);
        })
        break;
      default:
        break;
    }
  }

  promotionByChange(promotionById: number) {
    const index = this.listProduct.findIndex(x => x.id == promotionById);
    if (index !== -1) {
      this.baseForm.controls['promotionByName'].setValue(this.listProduct[index].productName);
      this.baseForm.controls['promotionColorName'].setValue(this.listProduct[index].productColors[0].colorName);
      this.baseForm.controls['promotionColorId'].setValue(this.listProduct[index].productColors[0].colorId);
      this.baseForm.controls['promotionSizeName'].setValue(this.listProduct[index].productSizes[0].sizeName);
      this.baseForm.controls['promotionSizeId'].setValue(this.listProduct[index].productSizes[0].sizeId);
      this.baseForm.controls['promotionImageUrl'].setValue(this.listProduct[index].productImages[0].imageUrl);
      this.baseForm.controls['promotionPrice'].setValue(this.listProduct[index].price);
    }
  }

  salesByChange(salesById: number) {
    const index = this.listProduct.findIndex(x => x.id == salesById);
    if (index !== -1) {
      this.baseForm.controls['salesByName'].setValue(this.listProduct[index].productName);
    }
  }

  disableFormControl(key: string) {
    this.baseForm.controls[key].disable();
    this.baseForm.controls[key].clearValidators();
    this.baseForm.controls[key].updateValueAndValidity();
  }

  enableFormControl(key: string) {
    this.baseForm.controls[key].enable();
    this.baseForm.controls[key].setValidators([Validators.required]);
    this.baseForm.controls[key].updateValueAndValidity();
  }
}

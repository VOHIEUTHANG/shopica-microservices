import { Category } from '@modules/category/models/category';
import { BrandService } from '@modules/brand/services/brand.service';
import { Brand } from '@modules/brand/models/brand';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-brand-modal',
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.css']
})
export class BrandModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() brand!: Brand;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<Brand>();
  @Output() updateSuccessEvent = new EventEmitter<Brand>();
  baseForm: FormGroup;
  isLoadingButton = false;
  brandId: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly brandService: BrandService,
    private readonly messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['brand'] != undefined && changes['brand'].currentValue != undefined) {
      this.baseForm.controls['brandName'].setValue(changes['brand'].currentValue.brandName);
      this.brandId = changes['brand'].currentValue.id;
    }
  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      brandName: [null, Validators.required],
    });
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
  }

  submitForm() {
    let brand: Brand = {
      brandName: this.baseForm.controls['brandName'].value,
    };
    if (this.isEditMode) {
      brand.id = this.brandId;
      this.updateBrand(brand);
    }
    else {
      this.addBrand(brand);
    }
  }

  addBrand(brand: Brand) {
    this.brandService.create(brand)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create brand successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }

  updateBrand(brand: Brand) {
    this.brandService.update(brand)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update brand successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }
}

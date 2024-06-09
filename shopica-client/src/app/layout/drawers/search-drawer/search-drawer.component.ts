import { CartItemOptions } from '@shared/modules/cart-item/models/cart-item-options.model';
import { CartItem } from '@core/model/cart/cart-item';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-drawer',
  templateUrl: './search-drawer.component.html',
  styleUrls: ['./search-drawer.component.css']
})
export class SearchDrawerComponent implements OnInit {
  @Input() isOpenSearchDrawer = false;
  @Output() closeSearchDrawerEvent = new EventEmitter<boolean>();
  searchForm: UntypedFormGroup;
  isLoading = false;

  cartItemOptions: CartItemOptions = {
    showPrice: true,
    size: 'small'
  };
  constructor(
    private readonly formBuilder: UntypedFormBuilder,

  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      categoryId: [null],
      productName: [null],
    });
  }

  closeMenu(): void {
    this.closeSearchDrawerEvent.emit(false);
  }
}

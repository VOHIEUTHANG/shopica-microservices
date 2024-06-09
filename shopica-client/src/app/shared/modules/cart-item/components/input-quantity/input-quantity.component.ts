import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-quantity',
  templateUrl: './input-quantity.component.html',
  styleUrls: ['./input-quantity.component.css']
})
export class InputQuantityComponent implements OnInit {

  @Input() quantity: number;
  @Input() available: number;
  @Output() quantityChange = new EventEmitter<number>();
  oldQuantity: number;
  constructor(
    private readonly messageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.oldQuantity = this.quantity;
  }

  increaseOne() {
    if (this.quantity + 1 > this.available) {
      this.messageService.error(`only ${this.available} product is available`)
      return;
    }
    this.quantity++;
    this.oldQuantity++;
    this.quantityChange.emit(this.quantity);
  }

  decreaseOne() {
    if (this.quantity > 1) {
      this.quantity--;
      this.oldQuantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  focusOut() {
    if (this.quantity == this.oldQuantity) {
      return;
    }

    if (this.quantity > this.available) {
      this.messageService.error(`only ${this.available} product is available`)
      this.quantity = this.oldQuantity
      return;
    }

    if (this.quantity < 1) {
      this.quantity = 1;
    }

    this.quantityChange.emit(this.quantity);
  }
}

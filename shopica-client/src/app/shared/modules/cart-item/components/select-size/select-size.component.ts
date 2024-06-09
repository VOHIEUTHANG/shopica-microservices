import { Size } from '@core/model/size/size';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-size',
  templateUrl: './select-size.component.html',
  styleUrls: ['./select-size.component.css']
})
export class SelectSizeComponent implements OnInit {

  @Input() listSize: Size[];
  @Input() sizeSelected: Size;
  @Output() sizeSelectedChange = new EventEmitter<Size>();
  constructor() { }

  ngOnInit(): void {

  }

  selectSize(size: Size) {
    this.sizeSelected = size;
    this.sizeSelectedChange.emit(this.sizeSelected);
  }
}

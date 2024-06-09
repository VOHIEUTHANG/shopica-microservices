import { Category } from '@core/model/category/category';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent implements OnInit {
  @Input() category: Category;
  constructor() { }

  ngOnInit(): void {
  }

}

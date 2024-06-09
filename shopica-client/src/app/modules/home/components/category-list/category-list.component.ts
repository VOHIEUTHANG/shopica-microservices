import { Category } from '../../../../core/model/category/category';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categoryList: Category[] = [
    {
      id: 1,
      categoryName: 'Women',
      imageURL: 'assets/images/categories/women.jpg',

    },
    {
      id: 2,
      categoryName: 'Bag',
      imageURL: 'assets/images/categories/bag.jpg',
    },
    {
      id: 3,
      categoryName: 'Shoes',
      imageURL: 'assets/images/categories/shoes.jpg',
    },
    {
      id: 4,
      categoryName: 'Watch',
      imageURL: 'assets/images/categories/watch.jpg',
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

import { Blog } from '../../../core/model/blog/blog';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent implements OnInit {

  @Input() blog: Blog;
  constructor() { }

  ngOnInit(): void {
  }

  getBackgroundStyle() {
    return { 'background-image': 'url("' + this.blog.backgroundUrl + '")' };
  }

}

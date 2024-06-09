import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit } from '@angular/core';
import { Comment, CommentDocumentType } from '@core/model/comment/comment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  comment: Comment = {
    id: 1,
    content: 'A good theme is one thing, but with brilliant support behind it, it becomes a great theme. I had to narrow down from quite a selection of good themes for my Shopify store, what settled it for me to choose Gecko, was the ability to have custom swatches for product variations. My code knowledge is very limited, so I needed help with some customization, and I am very impressed with the prompt support in getting the site looking just how I needed it on both desktop and mobile',
    customerImageUrl: 'assets/images/blogs/user-1.jpg',
    customerName: 'PhuongQuyen',
    createdAt: null,
    customerId: 1,
    rate: 5,
    documentId: 1,
    documentType: CommentDocumentType.Product,
    email: 'hieuvo044@gmail.com'
  };

  listComment: Comment[] = [
    {
      id: 1,
      content: 'A good theme is one thing, but with brilliant support behind it, it becomes a great theme. I had to narrow down from quite a selection of good themes for my Shopify store, what settled it for me to choose Gecko, was the ability to have custom swatches for product variations. My code knowledge is very limited, so I needed help with some customization, and I am very impressed with the prompt support in getting the site looking just how I needed it on both desktop and mobile',
      customerImageUrl: 'assets/images/blogs/user-1.jpg',
      customerName: 'PhuongQuyen',
      createdAt: null,
      customerId: 1,
      rate: 5,
      documentId: 1,
      documentType: CommentDocumentType.Product,
      email: 'hieuvo044@gmail.com'
    },
  ];

  customOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    skip_validateItems: true,
    responsive: {
      100: {
        items: 1
      },
    },
    nav: false,
  };
  constructor() { }

  ngOnInit(): void {
  }

}

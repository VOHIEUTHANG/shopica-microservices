import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardComponent } from './blog-card.component';



@NgModule({
  declarations: [BlogCardComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BlogCardComponent
  ]
})
export class BlogCardModule { }

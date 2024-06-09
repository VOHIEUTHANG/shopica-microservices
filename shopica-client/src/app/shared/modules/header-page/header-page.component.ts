import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.css']
})
export class HeaderPageComponent implements OnInit {

  @Input() image: string;
  @Input() pageName: string;
  @Input() subTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

}

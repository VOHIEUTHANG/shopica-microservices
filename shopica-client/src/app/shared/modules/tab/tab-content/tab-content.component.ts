import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.css']
})
export class TabContentComponent implements OnInit {
  @Input('tabTitle') title: string;
  @Input() active = false;
  constructor() { }

  ngOnInit(): void {
  }

}

import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { TabContentComponent } from '../tab-content/tab-content.component';

@Component({
  selector: 'app-ng-tabs',
  templateUrl: './ng-tabs.component.html',
  styleUrls: ['./ng-tabs.component.css']
})
export class NgTabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabContentComponent) tabs: QueryList<TabContentComponent>;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: any) {
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
  }
}

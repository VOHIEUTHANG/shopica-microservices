import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTabsComponent } from './ng-tabs/ng-tabs.component';
import { TabContentComponent } from './tab-content/tab-content.component';

@NgModule({
  declarations: [
    NgTabsComponent,
    TabContentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgTabsComponent,
    TabContentComponent
  ]
})
export class TabModule { }

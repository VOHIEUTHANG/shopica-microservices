import { Product } from './../../model/product/product';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openQuickView = new Subject<Product>();
  private closeQuickView = new Subject<boolean>();
  private openQuickShop = new Subject<Product>();
  private closeQuickShop = new Subject<boolean>();
  private openCartDrawer = new Subject<boolean>();
  private closeCartDrawer = new Subject<boolean>();
  private openLoginDrawer = new Subject<boolean>();
  private closeLoginDrawer = new Subject<boolean>();
  private openMenuDrawer = new Subject<boolean>();
  private closeMenuDrawer = new Subject<boolean>();

  openQuickViewEmitted$ = this.openQuickView.asObservable();
  closeQuickViewEmitted$ = this.closeQuickView.asObservable();
  openQuickShopEmitted$ = this.openQuickShop.asObservable();
  closeQuickShopEmitted$ = this.closeQuickShop.asObservable();
  openCartDrawerEmitted$ = this.openCartDrawer.asObservable();
  closeCartDrawerEmitted$ = this.closeCartDrawer.asObservable();
  openLoginDrawerEmitted$ = this.openLoginDrawer.asObservable();
  closeLoginDrawerEmitted$ = this.closeLoginDrawer.asObservable();
  openMenuDrawerEmitted$ = this.openMenuDrawer.asObservable();
  closeMenuDrawerEmitted$ = this.closeMenuDrawer.asObservable();
  constructor() { }

  openQuickViewEvent(product: Product) {
    this.openQuickView.next(product);
  }

  closeQuickViewEvent() {
    this.closeQuickView.next(false);
  }

  openQuickShopEvent(product: Product) {
    this.openQuickShop.next(product);
  }

  closeQuickShopEvent() {
    this.closeQuickShop.next(false);
  }

  openCartDrawerEvent() {
    this.openCartDrawer.next(true);
  }

  closeCartDrawerEvent() {
    this.closeCartDrawer.next(false);
  }

  openLoginDrawerEvent() {
    this.openLoginDrawer.next(true);
  }

  closeLoginDrawerEvent() {
    this.closeLoginDrawer.next(false);
  }

  openMenuDrawerEvent() {
    this.openMenuDrawer.next(true);
  }

  closeMenuDrawerEvent() {
    this.closeMenuDrawer.next(false);
  }
}

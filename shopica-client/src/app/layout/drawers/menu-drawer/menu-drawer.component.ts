import { ModalService } from './../../../core/services/modal/modal.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-drawer',
  templateUrl: './menu-drawer.component.html',
  styleUrls: ['./menu-drawer.component.css']
})
export class MenuDrawerComponent implements OnInit {
  isVisible = false;
  constructor(
    private readonly router: Router,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {

    this.modalService.openMenuDrawerEmitted$.subscribe(() => {
      this.isVisible = true;
    });

    this.modalService.closeMenuDrawerEmitted$.subscribe(data => {
      this.isVisible = false;
    });
  }

  closeMenu(): void {
    this.isVisible = false;
  }

  gotoPage(pageUrl: string) {
    this.isVisible = false;
    this.router.navigate([pageUrl]);
  }
}

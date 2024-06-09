import { environment } from './../../../../../environments/environment';
import { ProductService } from '@core/services/product/product.service';
import { StorageService } from '@core/services/storage/storage.service';
import { ShareService } from '@core/services/share/share.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Cart } from '@core/model/cart/cart';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly shareService: ShareService,
    private readonly storageService: StorageService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}

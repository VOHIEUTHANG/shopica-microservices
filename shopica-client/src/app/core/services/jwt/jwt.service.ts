import { environment } from './../../../../environments/environment';
import { StorageService } from './../storage/storage.service';
import { Injectable } from '@angular/core';

import { TokenData } from '../../model/token-data';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  user: TokenData;
  constructor(private readonly storageService: StorageService) { }

  getToken(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.token.token;
    }
    return null;
  }

  getRoleName(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.roleName;
    }
    return null;
  }

  isTokeExpire(): boolean {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null && this.user.exp * 1000 > Date.now()) {
      return true;
    }
    return false;
  }


  getName(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.username;
    }
    return null;
  }


  getEmail(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.username;
    }
    return null;
  }


  getUserName(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.username;
    }
    return null;
  }


  getUserId(): number {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.userId;
    }
    return null;
  }

  getImageUrl(): string {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.imageUrl;
    }
    return null;
  }

  getSocialLogin(): boolean {
    this.user = this.storageService.getValue<TokenData>(environment.tokenKey);
    if (this.user != null) {
      return this.user.isSocial;
    }
    return null;
  }
}

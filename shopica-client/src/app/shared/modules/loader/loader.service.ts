import { LoaderModule } from './loader.module';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Loader } from './loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader = new BehaviorSubject<Loader>({ id: 'global', status: false });

  loaderStatus$ = this.loader.asObservable();

  constructor() { }

  public showLoader(id: string = 'global'): void {
    this.loader.next({ id, status: true });
  }

  public hideLoader(id: string = 'global'): void {
    this.loader.next({ id, status: false });
  }
}

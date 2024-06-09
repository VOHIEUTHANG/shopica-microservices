import { LoaderService } from './loader.service';
import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Loader } from './loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() id = 'global';
  @Input() background = '#ffffff';
  @Input() flexStart = false;
  show: boolean;
  constructor(
    private readonly loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.loaderStatus$.subscribe((response: Loader) => {
      this.show = response.id === this.id ? response.status : this.show;
    });
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseEntryListComponent } from './warehouse-entry-list.component';

describe('WarehouseEntryListComponent', () => {
  let component: WarehouseEntryListComponent;
  let fixture: ComponentFixture<WarehouseEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseEntryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

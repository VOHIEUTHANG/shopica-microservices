import { finalize } from 'rxjs/operators';
import { SizeService } from './../../services/size.service';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Size } from '../../models/size';

@Component({
  selector: 'app-size-modal',
  templateUrl: './size-modal.component.html',
  styleUrls: ['./size-modal.component.css']
})
export class SizeModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() size!: Size;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<Size>();
  @Output() updateSuccessEvent = new EventEmitter<Size>();
  baseForm: FormGroup;
  isLoadingButton = false;
  sizeId: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sizeService: SizeService,
    private readonly messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['size'] != undefined && changes['size'].currentValue != undefined) {
      this.baseForm.controls['sizeName'].setValue(changes['size'].currentValue.sizeName);
      this.sizeId = changes['size'].currentValue.id;
    }

  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      sizeName: [null, Validators.required],
    });
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
  }

  submitForm() {
    let size: Size = {
      sizeName: this.baseForm.controls['sizeName'].value,
    };
    if (this.isEditMode) {
      size.id = this.sizeId;
      this.updateSize(size);
    }
    else {
      this.addSize(size);
    }
  }

  addSize(size: Size) {
    this.sizeService.create(size)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create size successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }

  updateSize(size: Size) {
    this.sizeService.update(size)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update size successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }
}

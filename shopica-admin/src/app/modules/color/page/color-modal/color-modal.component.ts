import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Color } from '../../models/Color';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-color-modal',
  templateUrl: './color-modal.component.html',
  styleUrls: ['./color-modal.component.css'],
})
export class ColorModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() color!: Color;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<Color>();
  @Output() updateSuccessEvent = new EventEmitter<Color>();
  disable: boolean;
  baseForm: FormGroup;
  isLoadingButton = false;
  colorId: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly colorService: ColorService,
    private readonly messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['color'] != undefined && changes['color'].currentValue != undefined) {
      this.baseForm.controls['colorName'].setValue(changes['color'].currentValue.colorName);
      this.baseForm.controls['colorCode'].setValue(changes['color'].currentValue.colorCode);
      this.colorId = changes['color'].currentValue.id;
    }

  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      colorName: [null, Validators.required],
      colorCode: ['#ffffff', Validators.required],
    });
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
  }

  submitForm() {
    let color: Color = {
      colorName: this.baseForm.controls['colorName'].value,
      colorCode: this.baseForm.controls['colorCode'].value,
    };
    if (this.isEditMode) {
      color.id = this.colorId;
      this.updateColor(color);
    }
    else {
      this.addColor(color);
    }
  }

  addColor(color: Color) {
    this.colorService.create(color)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create color successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }

  updateColor(color: Color) {
    this.colorService.update(color)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update color successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }
}

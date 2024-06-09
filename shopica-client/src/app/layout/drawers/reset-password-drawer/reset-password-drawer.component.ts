import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageService } from './../../../core/services/storage/storage.service';
import { environment } from '@env';
import { tap, finalize } from 'rxjs/operators';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-drawer',
  templateUrl: './reset-password-drawer.component.html',
  styleUrls: ['./reset-password-drawer.component.css']
})
export class ResetPasswordDrawerComponent implements OnInit {
  @Input() isOpenResetPasswordDrawer = false;
  @Output() closeResetPasswordDrawerEvent = new EventEmitter<boolean>();
  @Output() openLoginDrawerEvent = new EventEmitter<boolean>();
  firstForm: UntypedFormGroup;

  isLoading = false;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly messageService: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.firstForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  sendCode() {
    // validate
    for (const i in this.firstForm.controls) {
      this.firstForm.controls[i].markAsDirty();
      this.firstForm.controls[i].updateValueAndValidity();
    }

    if (this.firstForm.invalid) {
      return;
    }

    this.isLoading = true;
    const email = this.firstForm.controls.email.value;
    this.authService.sendVerifyCode(email).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.storageService.set(environment.emailToken, email);
          this.messageService.success('To reset password, please check you email!');
          this.closeMenu();
          this.firstForm.reset();
        }
        else {
          this.firstForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
  }


  closeMenu(): void {
    this.closeResetPasswordDrawerEvent.emit(false);
  }

  openLoginDrawer() {
    this.openLoginDrawerEvent.emit();
  }
}

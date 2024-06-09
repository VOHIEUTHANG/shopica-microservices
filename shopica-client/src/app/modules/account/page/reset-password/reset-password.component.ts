import { NzMessageService } from 'ng-zorro-antd/message';
import { tap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from './../../../../core/services/storage/storage.service';
import { AuthService } from './../../../../core/services/auth/auth.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env';
import { ResetPasswordRequest } from '@core/model/user/reset-password-request';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: UntypedFormGroup;
  isLoading = false;
  verifyToken: string;
  email: string;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.verifyToken = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.email = this.storageService.get(environment.emailToken);
  }

  buildForm() {
    this.resetForm = this.formBuilder.group({
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  confirmationValidator = (control: UntypedFormControl) => {
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== this.resetForm.controls.newPassword.value) {
      return { error: true, confirm: true };
    }
    return null;
  }


  resetPassword() {
    const request: ResetPasswordRequest = {
      email: this.email,
      resetToken: this.verifyToken,
      ...this.resetForm.value
    };
    this.isLoading = true;

    this.authService.resetPassword(request).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.messageService.success('Reset password successfully!');
          this.router.navigate(['/account/login']);
          this.storageService.remove(environment.emailToken);
        }
        else {
          this.resetForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => this.isLoading = false)
    ).subscribe();
  }

}

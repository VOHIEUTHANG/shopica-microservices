import { ShareService } from './../../../../core/services/share/share.service';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { LoginMethod } from './../../../../core/enum/login-method';
import { environment } from '@env';
import { StorageService } from './../../../../core/services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '@core/services/auth/auth.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  isLoading = false;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly shareService: ShareService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.authService.logout();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }


  submitForm() {
    // validate
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.invalid) {
      return;
    }
    const data = this.loginForm.value;
    this.isLoading = true;
    this.authService.login(data).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.loginSuccessAction();
          this.storageService.set(environment.loginMethod, LoginMethod.NORMAL);
        }
        else {
          this.loginForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => (this.isLoading = false))
    )
      .subscribe();
  }


  loginSuccessAction() {
    this.shareService.authenticateEvent(true);
    this.messageService.success('Login successfully!');
    this.router.navigate(['/home']);
    this.loginForm.reset();
  }
}

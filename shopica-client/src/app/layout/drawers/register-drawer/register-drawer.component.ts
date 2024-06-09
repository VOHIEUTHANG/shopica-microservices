import { NzMessageService } from 'ng-zorro-antd/message';
import { tap, finalize } from 'rxjs/operators';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { checkUsernameExist } from '@core/directive/exist-email.directive';

@Component({
  selector: 'app-register-drawer',
  templateUrl: './register-drawer.component.html',
  styleUrls: ['./register-drawer.component.css']
})
export class RegisterDrawerComponent implements OnInit {
  @Input() isOpenRegisterDrawer = false;
  @Output() closeRegisterDrawerEvent = new EventEmitter<boolean>();
  @Output() openLoginDrawerEvent = new EventEmitter<boolean>();
  registerForm: UntypedFormGroup;
  a: string;
  isLoading = false;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      username: [null, Validators.required, checkUsernameExist(this.authService)],
      password: [null, Validators.required],
    });
  }

  closeMenu(): void {
    this.closeRegisterDrawerEvent.emit();
  }

  openLoginDrawer() {
    this.openLoginDrawerEvent.emit();
  }

  submitForm() {
    // validate
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    const data = {
      ...this.registerForm.value,
      imageUrl: `https://ui-avatars.com/api/?background=random&name=${this.registerForm.controls.fullName.value.trimStart().substring(0, 1)}`
    };
    this.isLoading = true;
    this.authService.register(data).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.messageService.success('Register successfully!');
          this.registerForm.reset();
          this.openLoginDrawer();
        }
        else {
          this.registerForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => (this.isLoading = false))
    ).subscribe();
  }
}

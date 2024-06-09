import { ChangePasswordRequest } from './../../model/change-password-request';
import { finalize } from 'rxjs/operators';
import { ProfileService } from '@modules/profile/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { validPasswordValidator } from '@app/core/directive/valid-password.directive';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  isLoadingSubmit = false;
  revealCurrentPassword = false;
  revealNewPassword = false;
  revealConfirmPassword = false;
  userId: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly messageService: NzMessageService,
    private readonly utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.userId = this.utilitiesService.getUserId();
    this.buildForm();
  }

  buildForm() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, [validPasswordValidator(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'))]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  submitForm() {
    this.isLoadingSubmit = true;
    const data: ChangePasswordRequest = {
      id: this.userId,
      currentPassword: this.changePasswordForm.controls['currentPassword'].value,
      newPassword: this.changePasswordForm.controls['newPassword'].value,
    }

    this.profileService.changePassword(data)
      .pipe(
        finalize(() => this.isLoadingSubmit = false)
      ).subscribe(res => {
        if (res.isSuccess) {
          this.messageService.create("success", "change password successfully");
          this.changePasswordForm.reset();
        }
        else {
          this.changePasswordForm.setErrors({ "error": res.errorMessage });
        }
      })
  }


  confirmationValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== this.changePasswordForm.controls.newPassword.value) {
      return { error: true, confirm: true }
    }
    return null;
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validPasswordValidator(passwordRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = passwordRe.test(control.value);
    return forbidden ? null : { invalidPassword: true };
  }
}

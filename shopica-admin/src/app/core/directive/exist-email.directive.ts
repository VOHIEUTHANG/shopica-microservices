import { UserService } from './../../modules/auth/services/user.service';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable, of, timer } from "rxjs";
import { catchError, map, switchMap } from 'rxjs/operators';

export function existEmailValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
      switchMap(() => userService.checkUsernameExist(control.value)),
    )
  }
}

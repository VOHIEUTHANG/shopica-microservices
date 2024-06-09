import { AuthService } from './../services/auth/auth.service';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export function checkUsernameExist(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(1000).pipe(
      switchMap(() => authService.checkUsernameExist(control.value)),
    );
  };
}

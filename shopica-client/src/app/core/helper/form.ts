import { FormControl, UntypedFormGroup } from '@angular/forms';
export function validateForm(form: UntypedFormGroup) {
  for (const i in form.controls) {
    form.controls[i].markAsDirty();
    form.controls[i].updateValueAndValidity();
  }
  return form.invalid;
}

export function getBase64(img: File, callback: (img: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result!.toString()));
  reader.readAsDataURL(img);
}

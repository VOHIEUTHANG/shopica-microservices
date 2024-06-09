import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../core/services/contact/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  isLoading = false;
  contactForm!: UntypedFormGroup;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly contactService: ContactService,
    private readonly router: Router,
    private readonly messageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.pattern(/^(^\+251|^251|^0)?9\d{8}$/)]],
      message: [null, Validators.required],
    });
  }

  submitForm() {
    this.checkInput();
    const value = this.contactForm.value;
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.contactService
        .createContact(this.contactForm.value)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe((res) => {
          if (res.isSuccess) {
            this.contactForm.reset();
            this.router.navigate(['/home']);
            this.messageService.success('Thanks you for your contact!')
          }
        });
    }
  }

  checkInput() {
    for (const i in this.contactForm.controls) {
      this.contactForm.controls[i].markAsDirty();
      this.contactForm.controls[i].updateValueAndValidity();
    }
  }
}

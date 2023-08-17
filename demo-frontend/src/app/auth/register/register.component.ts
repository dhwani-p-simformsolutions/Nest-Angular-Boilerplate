import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, map } from 'rxjs';
import { showErrorToast } from 'src/app/utils/errorHandler';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  loading = false;
  registerForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private toast: ToastrService,
    private router: Router
  ) {}

  handleRegister() {
    this.loading = true;
    const values = this.registerForm.getRawValue();
    this.authService
      .signupUser({
        firstName: values.firstName!,
        lastName: values.lastName!,
        email: values.email!,
        password: values.password!,
      })
      .pipe(
        map((response: any) => {
          this.authService.signedIn$.next(true);
          this.cookieService.put('token', response.data.accessToken);
          window.localStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
          );
          this.toast.success('Register Success!');
          this.router.navigateByUrl('/');
        }),
        catchError((err) => {
          showErrorToast(this.toast, err);
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {});
  }
}

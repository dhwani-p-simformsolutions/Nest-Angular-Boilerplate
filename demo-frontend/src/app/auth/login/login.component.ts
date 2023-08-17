import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, map } from 'rxjs';
import { showErrorToast } from 'src/app/utils/errorHandler';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toast: ToastrService
  ) {}

  loginUser() {
    this.loading = true;
    const values = this.loginForm.getRawValue();

    this.authService
      .loginUser(values.email!, values.password!)
      .pipe(
        map((response: any) => {
          this.authService.signedIn$.next(true);
          this.cookieService.put('token', response.data.accessToken);
          window.localStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
          );
          this.toast.success('Login Success!');
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

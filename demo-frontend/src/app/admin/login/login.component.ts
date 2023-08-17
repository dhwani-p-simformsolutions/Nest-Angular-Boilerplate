import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  loading = false;
  loginForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  handleLoginForm() {
    this.loading = true;
    const values = this.loginForm.getRawValue();
    this.authService
      .loginUser(values.password!)
      .pipe(
        map((response) => {
          // document.cookie = `access_token=${response.accessToken}; expires=${now.toUTCString()}; path=/; HttpOnly; Secure`;

          this.authService.signedIn$.next(true);
          window.localStorage.setItem('adminLogin', 'true');
          this.toast.success('Login Success!');
          this.router.navigateByUrl('/admin');
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

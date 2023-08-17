import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { AuthService as AdminAuthService } from './admin/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  signedIn$: BehaviorSubject<boolean | null>;
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private adminAuthService: AdminAuthService
  ) {
    this.signedIn$ = this.authService.signedIn$;
  }
  title = 'demo';

  ngOnInit(): void {
    if (this.cookieService.get('token')) {
      this.authService
        .getCurrentUser()
        .pipe(
          map((user: any) => {
            if (user.data.email) {
              this.authService.signedIn$.next(true);
            }
          }),
          catchError((err) => {
            this.authService.signedIn$.next(false);
            return EMPTY;
          })
        )
        .subscribe(() => {});
    } else {
      this.authService.signedIn$.next(false);
    }
    const adminCheck = localStorage.getItem('adminLogin');
    if (adminCheck && adminCheck === 'true') {
      this.adminAuthService.signedIn$.next(true);
    } else {
      this.adminAuthService.signedIn$.next(false);
    }
  }
}

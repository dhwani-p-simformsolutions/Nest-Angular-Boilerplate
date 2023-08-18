import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, private cookieService: CookieService, private authService: AuthService) {
    this.authService.signedIn$.next(false);
    this.cookieService.removeAll();
    window.localStorage.clear();
    this.router.navigateByUrl("/auth/login");
  }
}

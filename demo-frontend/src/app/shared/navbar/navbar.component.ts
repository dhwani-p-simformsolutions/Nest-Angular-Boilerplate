import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthService as AdminAuthService } from "../../admin/services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  signedin$: BehaviorSubject<boolean | null>;
  adminSignedIn$: BehaviorSubject<boolean | null>;

  constructor(private authService: AuthService, private adminAuthService: AdminAuthService, private router: Router) {
    this.signedin$ = this.authService.signedIn$;
    this.adminSignedIn$ = this.adminAuthService.signedIn$;
  }

  handleAdminLogout() {
    this.adminAuthService.signedIn$.next(false);
    window.localStorage.removeItem("adminLogin");
    this.router.navigateByUrl("/admin/login");
  }
}

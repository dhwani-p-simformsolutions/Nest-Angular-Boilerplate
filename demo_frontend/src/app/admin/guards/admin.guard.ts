import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, skipWhile, take } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AdminCanActive implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.signedIn$.pipe(skipWhile((value) => value === null),
      take(1), map(value => {
        if (value) {
          return true;
        } else {
          this.router.navigateByUrl("/admin/login");
          return false;
        }
      }));
  }

}
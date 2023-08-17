import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { BehaviorSubject, EMPTY, map, Observable, skipWhile, take, tap } from 'rxjs';
import { AuthService } from './services/auth.service';
type canloadType = boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;

@Injectable({
    providedIn: 'root',
})
export class AuthGaurd implements CanLoad {
    constructor(private authService: AuthService, private router: Router) { }
    canLoad(route: Route, segments: UrlSegment[]): canloadType {
        return this.authService.signedIn$.pipe(
            skipWhile((value) => value === null),
            take(1),
            tap((authenticated) => {
                if (!authenticated) {
                    this.router.navigate(['/']);
                }
            }),
            map((value) => {
                return true;
            }),
        );
    }
}

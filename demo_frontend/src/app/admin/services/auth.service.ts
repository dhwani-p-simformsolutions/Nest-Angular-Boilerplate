import { Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  constructor() { }

  loginUser(password: string) {
    if (password === "Simform123") {
      this.signedIn$.next(true);
      return of(true);
    } else {
      this.signedIn$.next(false);
      return throwError(() => {
        return new Error("Invalid credentials!");
      })
    }
  }
}

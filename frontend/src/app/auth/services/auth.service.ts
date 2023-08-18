import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/user.interface';

export interface UserLoginData {
  user: UserInterface;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  constructor(private http: HttpClient) {}

  loginUser(email: string, password: string) {
    return this.http.post<ResponseInterface<UserLoginData>>('/user/login', {
      email,
      password,
    });
  }

  signupUser(user: Omit<UserInterface, '_id'> & { password: string }) {
    return this.http.post<ResponseInterface<Partial<UserLoginData>>>(
      '/user/signup',
      user
    );
  }

  getCurrentUser() {
    return this.http.get<ResponseInterface<{ user: UserInterface }>>(
      '/user/me'
    );
  }
}

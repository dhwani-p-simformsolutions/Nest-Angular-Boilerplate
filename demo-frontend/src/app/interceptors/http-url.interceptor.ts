import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class HttpUrlInterceptor implements HttpInterceptor {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headers: { [key: string]: string } = {};
    const token = this.cookieService.get('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = request.clone({
      url: `${this.baseUrl}${request.url}`,
      setHeaders: headers,
    });
    return next.handle(req);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthFacade, AuthState } from '../../store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  authState: AuthState;

  constructor(private authFacade: AuthFacade) {
    this.authFacade.auth$.subscribe(
      (authState: AuthState) => (this.authState = authState)
    );
  }

  // handle 401/403 token was expired
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      if (this.authState.isLoggedIn) {
        this.authFacade.logout();
      }
    }
    return throwError(err);
  }

  // handle next request, apply access token if available
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.authState.isLoggedIn && this.authState.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authState.accessToken}`,
        },
      });
    }

    return next
      .handle(request)
      .pipe(catchError((e) => this.handleAuthError(e)));
  }
}

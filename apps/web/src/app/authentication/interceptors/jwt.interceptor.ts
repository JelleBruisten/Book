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
import { AuthFacade } from '../../store/auth/auth.facade';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authFacade: AuthFacade) {}

  // handle 401/403 token was expired
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.authFacade.logout();
    }
    return throwError(err);
  }

  // handle next request, apply access token if available
  private handleNext(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    accessToken?: string
  ): Observable<HttpEvent<unknown>> {
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return next
      .handle(request)
      .pipe(catchError((e) => this.handleAuthError(e)));
  }

  // intercept the request
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // check authentication status
    return this.authFacade.authenticated$.pipe(
      switchMap((loggedIn: boolean) => {
        // if logged in request access token info
        if (loggedIn) {
          return this.authFacade.accessToken$.pipe(
            switchMap((accessToken) =>
              this.handleNext(request, next, accessToken)
            )
          );
        } else {
          return this.handleNext(request, next);
        }
      })
    );
  }
}

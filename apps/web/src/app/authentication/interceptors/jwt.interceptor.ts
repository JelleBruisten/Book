import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthFacade, AuthState } from '../../store/auth/auth.facade';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private jwtToken = {
    accessToken: '',
    refreshToken: '',
  };

  constructor(
    private authFacade: AuthFacade
  ) {
    this.authFacade.auth$.subscribe((auth: AuthState) => {
      this.jwtToken.accessToken = auth.accessToken;
      this.jwtToken.refreshToken = auth.accessToken;
    });
  }

  private addAccessToken(
    request: HttpRequest<unknown>,
    accessToken: string
  ): HttpRequest<unknown> {
    return (request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }));
  }

  // intercept the request
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.jwtToken.accessToken;
    if (accessToken) {
      request = this.addAccessToken(request, accessToken);
    }
    return this.handleNext(request, next);
  }

  handleNext(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          this.authFacade.logout();
        }
        return throwError(err);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthFacade, AuthState } from '../../store/auth/auth.facade';
import { AuthenticationService } from '../services/authentication.service';
import { JwtUtil } from '../util/jwt.util';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private refreshingInProgress: boolean;
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  auth: AuthState;

  constructor(private authFacade: AuthFacade, private authenticationService: AuthenticationService) {
    this.authFacade.auth$.subscribe((auth: AuthState) => {
      this.auth = auth;

      if(auth.accessToken && auth.refreshToken) {
        console.log(new Date(JwtUtil.expirationTime(auth.accessToken)));
        console.log(new Date(JwtUtil.expirationTime(auth.refreshToken)));
      }
    });
  }

  // intercept the request
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthorizationHeader(request, this.auth.accessToken)).pipe(
      catchError((error: HttpEvent<any>) => {
        // error 401
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (this.auth.accessToken && this.auth.refreshToken) {
            return this.refreshToken(request, next);
          } else {
            return this.logout(error);
          }
        }
        return throwError(error);
      })
    );
  }

  private addAuthorizationHeader(
    request: HttpRequest<unknown>,
    accessToken: string
  ): HttpRequest<unknown> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return request;
  }

  private logout(error: any) {
    this.authFacade.logout();
    return throwError(error);
  }

  private refreshToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log("refresh token");
    if(!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next(null);

      return this.authenticationService.refreshAccessToken(this.auth.refreshToken).pipe(
        switchMap(
          (response) => {
            this.refreshingInProgress = false;
            this.authFacade.setAccessToken(response.accessToken);
            return next.handle(
              this.addAuthorizationHeader(request, response.accessToken)
            );
          }
        )
      );
    }
    else {

      return this.accessTokenSubject.pipe(
        filter(
          (accessToken) => accessToken !== null
        ),
        take(1),
        switchMap(
          (accessToken) => {
            return next.handle(this.addAuthorizationHeader(request, accessToken));
          }
        )
      );
    }
  }
}

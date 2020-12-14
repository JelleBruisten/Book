import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@book/interfaces';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { map, tap, catchError, exhaustMap } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import * as AuthActions from './auth.actions';

const sessionStorageJwtKey = 'JwtToken';

@Injectable()
export class AuthEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngrxOnInitEffects(): Action {
    return AuthActions.authHydrate();
  }

  // on init
  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authHydrate),
      map(() => {
        const storageValue = sessionStorage.getItem(sessionStorageJwtKey);
        const storageValue2 = localStorage.getItem(sessionStorageJwtKey);
        if (storageValue && storageValue2) {
          try {
            return AuthActions.authHydrateSuccess({
              accessToken: JSON.parse(storageValue),
              refreshToken: JSON.parse(storageValue2),
            });
          } catch {
            return AuthActions.authHydrateFailure();
          }
        }
        return AuthActions.authHydrateFailure();
      })
    )
  );

  // on failure
  hydrateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authHydrateFailure, AuthActions.logout),
        tap(() => {
          sessionStorage.removeItem(sessionStorageJwtKey);
          localStorage.removeItem(sessionStorageJwtKey);
        })
      ),
    {
      dispatch: false,
    }
  );

  // on login, connect to api
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((user: Partial<User>) => {
        return this.authService
          .login({
            username: user.username,
            password: user.password,
          })
          .pipe(
            map((response: { accessToken: string, refreshToken: string }) =>
              AuthActions.loginSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
              })
            ),
            catchError(() => of(AuthActions.loginFailure()))
          );
      })
    )
  );

  // on success navigate to /
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((props: { accessToken: string, refreshToken: string }) => {
          sessionStorage.setItem(
            sessionStorageJwtKey,
            JSON.stringify(props.accessToken)
          );
          localStorage.setItem(
            sessionStorageJwtKey,
            JSON.stringify(props.refreshToken)
          );          
          this.router.navigate(['/']);
        })
      ),
    {
      dispatch: false,
    }
  );

  // on logout, we might wanna have our authService call backend let them know hey we're gone
  // then dispatch logoutComplete()
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      // tap(() => this.authService.logout()),
      map(() => AuthActions.logoutComplete())
    )
  );

  // on logout navigate to login
  logoutComplete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutComplete),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}

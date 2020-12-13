import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@book/interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, tap, catchError, exhaustMap } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

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
            map((response) =>
              AuthActions.loginSuccess({
                accessToken: response.access_token,
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
        tap(() => this.router.navigate(['/']))
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

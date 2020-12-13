import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@book/interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap((a) => console.log(a)),
      switchMap((user: Partial<User>) =>
        this.authService
          .login({
            username: user.username,
            password: user.password,
          })
          .pipe(
            tap((a) => console.log(a)),
            map((response) =>
              AuthActions.loginSuccess({
                accessToken: response.access_token,
                isLoggedIn: true,
              })
            ),
            catchError(() => of(AuthActions.loginFailure()))
          )
      )
    )
  );

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

  // checkauth$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.checkAuth),
  //     switchMap(() =>
  //       this.authService
  //         .checkAuth()
  //         .pipe(
  //           map((isLoggedIn) =>
  //             fromAuthActions.checkAuthComplete({ isLoggedIn })
  //           )
  //         )
  //     )
  //   )
  // );

  // checkAuthComplete$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromAuthActions.checkAuthComplete),
  //     switchMap(({ isLoggedIn }) => {
  //       if (isLoggedIn) {
  //         return this.authService.userData.pipe(
  //           map((profile) =>
  //             fromAuthActions.loginComplete({ profile, isLoggedIn })
  //           )
  //         );
  //       }
  //       return of(fromAuthActions.logoutComplete());
  //     })
  //   )
  // );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.logoutComplete())
    )
  );

  logoutComplete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutComplete),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}

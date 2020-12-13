import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '@book/interfaces';
import { AuthState } from './auth.reducer';
import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  readonly authenticated$ = this.store.select(
    AuthSelectors.selectIsAuthenticated
  );
  readonly accessToken$ = this.store.select(AuthSelectors.selectAccessToken);
  readonly error$ = this.store.select(AuthSelectors.selectError);
  readonly loading$ = this.store.select(AuthSelectors.selectLoading);

  constructor(private store: Store<AuthState>) {}

  login(user: User) {
    this.store.dispatch(AuthActions.login(user));
  }

  clear() {
    this.store.dispatch(AuthActions.loginClear());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}

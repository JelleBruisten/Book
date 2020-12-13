import { User } from '@book/interfaces';
import { createAction, props } from '@ngrx/store';

// export const checkAuth = createAction('[Auth] checkAuth');
// export const checkAuthComplete = createAction(
//   '[Auth] checkAuthComplete',
//   props<{ isLoggedIn: boolean }>()
// );

export const login = createAction('[Auth] login', props<User>());

export const loginSuccess = createAction(
  '[Auth] loginSuccess',
  props<{ accessToken: string; isLoggedIn: boolean }>()
);
export const loginFailure = createAction('[Auth] loginFailure');
export const loginClear = createAction('[Auth] loginClear');

export const logout = createAction('[Auth] logout');
export const logoutComplete = createAction('[Auth] logoutComplete');

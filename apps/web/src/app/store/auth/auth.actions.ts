import { User } from '@book/interfaces';
import { createAction, props } from '@ngrx/store';

// hydrate
export const authHydrate = createAction('[Auth] hydrate');
export const authHydrateSuccess = createAction(
  '[Auth] hydrateSuccess',
  props<{ accessToken: string, refreshToken: string }>()
);
export const authHydrateFailure = createAction('[Auth] hydrateFailure');

// login
export const login = createAction('[Auth] login', props<User>());

export const loginSuccess = createAction(
  '[Auth] loginSuccess',
  props<{ accessToken: string, refreshToken: string }>()
);
export const loginFailure = createAction('[Auth] loginFailure');
export const loginClear = createAction('[Auth] loginClear');

// logout
export const logout = createAction('[Auth] logout');
export const logoutComplete = createAction('[Auth] logoutComplete');

// refresh token
export const refreshAccessToken = createAction('[Auth] refreshAccessToken', props<{ accessToken: string }>());

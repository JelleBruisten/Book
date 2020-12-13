import { createReducer, on, Action } from '@ngrx/store';
import * as authActions from './auth.actions';

export const authFeatureName = 'auth';

// the shape of our state
export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string;
  loading: boolean;
  error: boolean;
}

// initial state
export const initialAuthState: AuthState = {
  isLoggedIn: false,
  accessToken: null,
  loading: false,
  error: false,
};

// internal reducer
const authReducerInternal = createReducer(
  initialAuthState,

  on(authActions.login, (state, {}) => {
    return {
      ...state,
      loading: true,
      error: false,
    };
  }),

  on(authActions.loginSuccess, (state, { accessToken, isLoggedIn }) => {
    return {
      ...state,
      accessToken,
      isLoggedIn,
      loading: false,
    };
  }),

  on(authActions.loginFailure, (state, {}) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }),

  on(authActions.loginClear, (state, {}) => {
    return {
      ...state,
      loading: false,
      error: false,
    };
  }),

  on(authActions.logout, (state, {}) => {
    return {
      ...state,
      accessToken: null,
      isLoggedIn: false,
    };
  })
);

// reducer
export function authReducer(state: AuthState | undefined, action: Action) {
  return authReducerInternal(state, action);
}

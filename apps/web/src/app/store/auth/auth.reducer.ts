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

  // on login set loading to true, and error to false
  on(authActions.login, (state, {}) => {
    return {
      ...state,
      loading: true,
      error: false,
    };
  }),

  // on success loading becomes false, and we set accessToken and isLoggedIn
  on(
    authActions.loginSuccess,
    authActions.authHydrateSuccess,
    (state, { accessToken, refreshToken }) => {
      return {
        ...state,
        accessToken,
        refreshToken,
        isLoggedIn: true,
        loading: false,
      };
    }
  ),

  // on failure to login, we set loading to false, and error to true
  on(authActions.loginFailure, (state, {}) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }),

  // on a loginClear we reset the loading and error to false
  on(authActions.loginClear, (state, {}) => {
    return {
      ...state,
      loading: false,
      error: false,
    };
  }),

  // on logging out we remove the accessToken and set isLoggedIn to false
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

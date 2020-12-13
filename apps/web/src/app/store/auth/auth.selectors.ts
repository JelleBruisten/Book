import { AuthState, authFeatureName } from './auth.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getAuthFeatureState = createFeatureSelector(authFeatureName);

export const selectIsAuthenticated = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.isLoggedIn
);

export const selectAccessToken = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.accessToken
);

export const selectError = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.error
);

export const selectLoading = createSelector(
  getAuthFeatureState,
  (state: AuthState) => state.loading
);

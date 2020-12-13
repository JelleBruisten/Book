import { authReducer, AuthEffects } from './auth';

export * from './auth';

export const appReducer = {
  auth: authReducer,
};

export const appEffects = [AuthEffects];

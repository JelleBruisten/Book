import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';

import { User } from '@book/interfaces';
import { environment } from '../../../environments/environment';
import { delay, first, switchMap, tap, throttleTime } from 'rxjs/operators';
import { AuthFacade } from '../../store/auth/auth.facade';

const apiUrl = environment.apiURL + '/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private authFacade: AuthFacade) {
    // const jwtToken = sessionStorage.getItem(LOCAL_STORE_JWT_TOKEN_KEY);
    // if (jwtToken) {
    //   this.jwtToken = jwtToken;
    //   this.loggedInSubject = new BehaviorSubject<boolean>(true);
    // } else {
    //   this.jwtToken = undefined;
    //   this.loggedInSubject = new BehaviorSubject<boolean>(false);
    // }
  }

  login(user: Partial<User>): Observable<{ accessToken: string, refreshToken: string }> {
    return timer(2000).pipe(
      first(),
      switchMap(() => this.http.post<{ accessToken: string, refreshToken: string }>(apiUrl, user))
    );
  }

  logout(): Observable<void> {
    return of();
  }

  refresh(refreshToken: string) {
    return this.http.put<{ accessToken: string }>(apiUrl, {
      refreshToken
    });
  }

  // setToken(accessToken: string) {
  //   if (!this.loggedInSubject.value) {
  //     this.loggedInSubject.next(true);
  //   }
  //   this.jwtToken = accessToken;
  //   sessionStorage.setItem(LOCAL_STORE_JWT_TOKEN_KEY, accessToken);
  // }

  // getJwtToken() {
  //   return this.jwtToken;
  // }

  // removeJwtToken() {
  //   if (this.loggedInSubject.value) {
  //     this.loggedInSubject.next(false);
  //   }
  //   this.jwtToken = undefined;
  //   sessionStorage.removeItem(LOCAL_STORE_JWT_TOKEN_KEY);
  // }

  // get loggedIn() {
  //   return this.loggedInSubject.value;
  // }

  // get loggedIn$() {
  //   return this.loggedInSubject.asObservable();
  // }
}

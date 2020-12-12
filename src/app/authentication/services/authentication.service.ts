import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOCAL_STORE_JWT_TOKEN_KEY } from '../constants';

const apiUrl = 'http://localhost:3000/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private jwtToken: string;
  private loggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    const jwtToken = sessionStorage.getItem(LOCAL_STORE_JWT_TOKEN_KEY);
    if (jwtToken) {
      this.jwtToken = jwtToken;
      this.loggedInSubject = new BehaviorSubject<boolean>(true);
    } else {
      this.jwtToken = undefined;
      this.loggedInSubject = new BehaviorSubject<boolean>(false);
    }
  }

  login(username: string, password: string) {
    return this.http.post(apiUrl, { username, password }).pipe(
      tap(
        (response: { access_token: string }) => {
          this.setToken(response.access_token);
        },
        () => {
          this.removeJwtToken();
        }
      )
    );
  }

  logout() {
    this.removeJwtToken();
  }

  setToken(access_token: string) {
    if (!this.loggedInSubject.value) {
      this.loggedInSubject.next(true);
    }
    this.jwtToken = access_token;
    sessionStorage.setItem(LOCAL_STORE_JWT_TOKEN_KEY, access_token);
  }

  getJwtToken() {
    return this.jwtToken;
  }

  removeJwtToken() {
    if (this.loggedInSubject.value) {
      this.loggedInSubject.next(false);
    }
    this.jwtToken = undefined;
    sessionStorage.removeItem(LOCAL_STORE_JWT_TOKEN_KEY);
  }

  get loggedIn() {
    return this.loggedInSubject.value;
  }

  get loggedIn$() {
    return this.loggedInSubject.asObservable();
  }
}

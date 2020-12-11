import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LOCAL_STORE_JWT_TOKEN_KEY } from '../constants';

const apiUrl = 'http://localhost:3000/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private jwtToken: string;

  constructor(private http: HttpClient) {
    const jwtToken = sessionStorage.getItem(LOCAL_STORE_JWT_TOKEN_KEY);
    if (jwtToken) {
      this.jwtToken = jwtToken;
    }
  }

  login(username: string, password: string) {
    this.http.post(apiUrl, { username, password }).pipe(
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
    this.jwtToken = access_token;
    sessionStorage.setItem(LOCAL_STORE_JWT_TOKEN_KEY, access_token);
  }

  getJwtToken() {
    return this.jwtToken;
  }

  removeJwtToken() {
    this.jwtToken = undefined;
    sessionStorage.removeItem(LOCAL_STORE_JWT_TOKEN_KEY);
  }

  get loggedIn() {
    return this.jwtToken !== undefined;
  }
}

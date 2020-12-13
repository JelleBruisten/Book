import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication/services/authentication.service';
import { AuthFacade } from './store/auth/auth.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'book';
  loggedin$ = this.authFacade.authenticated$;

  constructor(private authFacade: AuthFacade) {}

  logout() {
    this.authFacade.logout();
  }
}

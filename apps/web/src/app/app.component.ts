import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'book';
  loggedin$ = this.authenticationService.loggedIn$;

  constructor(private authenticationService: AuthenticationService) {
  }

  logout() {
    this.authenticationService.logout();
  }
}

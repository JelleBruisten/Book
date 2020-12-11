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
  loggedin$: Observable<boolean>;

  constructor(private authenticationService: AuthenticationService) {
    this.loggedin$ = this.authenticationService.loggedIn$;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from '@book/interfaces';

const userProperties = ['username', 'password'];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userProperties = userProperties;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const formDefinition = {};
    for (const userProperty of userProperties) {
      formDefinition[userProperty] = [null, Validators.required];
    }
    this.loginForm = this.formBuilder.group(formDefinition);
  }

  login() {
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value as User;
      this.authenticationService.login(user.username, user.password).subscribe(
        () => {
          this.router.navigate(['/']);
        },
        () => alert('Login unsuccessfull')
      );
    }
  }
}

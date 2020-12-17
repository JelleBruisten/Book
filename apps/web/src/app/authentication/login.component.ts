import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, userProperties } from '@book/interfaces';
import { AuthFacade } from '../store/auth/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userProperties = userProperties;

  constructor(
    private formBuilder: FormBuilder,
    public authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.authFacade.clear();
    const formDefinition = {};
    for (const userProperty of userProperties) {
      formDefinition[userProperty] = [null, Validators.required];
    }

    this.loginForm = this.formBuilder.group(formDefinition);
  }

  login() {
    if (this.loginForm.valid) {
      const user: User = this.loginForm.value as User;
      this.authFacade.login(user);
    }
  }
}

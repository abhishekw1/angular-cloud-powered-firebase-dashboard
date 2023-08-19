import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading: boolean = false;
  action: 'login' | 'signup' = 'login';
  error = null;
  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit(form: NgForm) {
    this.loading = true;
    this.error = null;
    const { email, password, firstName, lastName } = form.value;

    let resp;
    try {
      if (this.isSignUp) {
        resp = await this.authService.signUp(
          email,
          password,
          firstName,
          lastName
        );
        form.reset();
      } else {
        resp = await this.authService.login(email, password);
      }
    } catch (error: any) {
      const errorMessage = error.message.replace(/Firebase: (.+?) \(.*/, '$1');
      this.error = errorMessage;
    }
    this.loading = false;
  }

  get isLogin() {
    return this.action === 'login';
  }

  get isSignUp() {
    return this.action === 'signup';
  }
}

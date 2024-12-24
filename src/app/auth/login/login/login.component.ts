import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { validate } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DummyService } from '../../../core/services/dummy.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  myForm: FormGroup;
  error = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dummyService: DummyService
  ) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin(): void {
    const { email, password } = this.myForm.value;

    this.dummyService.login(email, password).subscribe((user) => {
      if (user) {
        this.dummyService.setUser(user);
        this.router.navigate([user.role]);
      } else {
        this.error = 'Invalid email or password';
      }
    });
  }
}

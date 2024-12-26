import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  error = '';

  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dummyService: DummyService,
    private scroller: ViewportScroller
  ) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.scroller.scrollToPosition([0, 0]);
  }

  onLogin(): void {
    const { email, password } = this.myForm.value;

    this.authService.login(email, password).subscribe((user) => {
      if (user) {
        this.authService.setUser(user);
        this.router.navigate([user.role]);
      } else {
        this.error = 'Invalid email or password';
      }
    });
  }

  toggleHide() {
    this.hide = !this.hide;
  }
}

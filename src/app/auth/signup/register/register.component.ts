import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isRegister = false;
  users = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    role: 'user',
  };

  usersData: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.scroller.scrollToPosition([0, 0]);
  }

  onSubmit() {
    this.authService.register(this.users).subscribe((res) => {
      console.log('User Register successfully', res);
      this.isRegister = true;
      setTimeout(() => {
        this.isRegister = false;
      }, 2000);
      this.formEmpty();
      this.router.navigate(['/login']);
    });
  }

  formEmpty() {
    this.users = {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      address: '',
      role: '',
    };
  }
}

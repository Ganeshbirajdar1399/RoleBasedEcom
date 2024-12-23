import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../core/services/users/users.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isRegister = false;
  users = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
  };

  usersData: any[] = [];

  constructor(private userService: UsersService, private router: Router) {}

  fetchUsers() {
    this.userService.fetchUsers().subscribe((res) => {
      this.usersData = res;
      console.log('All Users', res);
    });
  }

  addUsers() {
    this.userService.addUsers(this.users).subscribe((res) => {
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
    };
  }
}

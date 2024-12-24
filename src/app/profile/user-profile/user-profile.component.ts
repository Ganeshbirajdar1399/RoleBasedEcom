import { Component, OnInit } from '@angular/core';
import { DummyService } from '../../core/services/dummy.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  loggedInUser: any = null;

  constructor(private dummyService: DummyService) {}

  ngOnInit(): void {
    this.loggedInUser = this.dummyService.getUser(); // Fetch user data
  }

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.dummyService.isLoggedIn(); // Check if the user is logged in
  }
}

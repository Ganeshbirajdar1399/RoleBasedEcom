import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DummyService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          console.log('API response:', users);
          if (users.length > 0) {
            return users[0];
          }
          throw new Error('Invalid credentials');
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  // Save user data to localStorage
  setUser(user: any): void {
    try {
      const userData = JSON.stringify(user);
      localStorage.setItem('user', userData);
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }

  // Get user data from localStorage
  getUser(): any {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(
        'Error parsing user data from localStorage. Clearing invalid data.',
        error
      );
      localStorage.removeItem('user');
      return null;
    }
  }

  // Get the role of the currently logged-in user
  getRole(): string {
    const user = this.getUser();
    return user ? user.role : ''; // Return an empty string if no role
  }

  // Check if a user is logged in
  isLoggedIn(): boolean {
    return !!this.getUser(); // Check if a valid user object exists
  }

  // Log out the user
  logout(): void {
    alert('sure! you want to logout');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    this.router.navigate(['']);
  }
}

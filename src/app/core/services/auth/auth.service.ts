import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { Users } from './users';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3001'; // Base API URL

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.getUser()
  );
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password }; // Send plain text password to the backend
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      map((user) => {
        if (user) {
          this.setUser(user);
          this.userSubject.next(user);
          this.showSnackbar(
            `${user.firstName} ${user.lastName} logged in successfully`
          );
          return user;
        }
        throw new Error('Invalid credentials');
      }),
      catchError((error) => {
        this.showSnackbar('Login failed', 3000);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}/register`, user).pipe(
      map((newUser) => {
        this.showSnackbar('User registered successfully', 3000);
        return newUser;
      }),
      catchError((error) => {
        this.showSnackbar('Registration failed', 3000);
        return throwError(() => error);
      })
    );
  }

  // Update user details
  updateUser(updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/users/${updatedUser.id}`; // Construct URL for PUT request
    return this.http.put(url, updatedUser); // Send PUT request
  }

  DeletetData(id: string) {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.delete(url); // Replace with your backend URL
  }

  setUser(user: any): void {
    try {
      sessionStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  getUser(): any {
    try {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user data. Clearing corrupted data:', error);
      sessionStorage.removeItem('user');
      return null;
    }
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || ''; // Use optional chaining
  }

  isLoggedIn(): boolean {
    return !!this.getUser(); // Return true if user exists
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('user'); // Clear user data
      this.router.navigate(['']); // Navigate to the home page
      this.userSubject.next(null); // Emit a null value to indicate logged-out state
    }
  }

  fetchUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.log('Error fetching users:', error);
        return of([]);
      })
    );
  }
}

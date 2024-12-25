import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DummyService {
  private readonly apiUrl = 'http://localhost:3000/users'; // Base API URL

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.getUser()
  );
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const queryParams = `?email=${email}&password=${password}`;
    return this.http.get<any[]>(`${this.apiUrl}${queryParams}`).pipe(
      map((users) => {
        if (users.length > 0) {
          this.setUser(users[0]); // Update the user data in localStorage
          this.userSubject.next(users[0]); // Emit the new user to the observabl

          return users[0]; // Return the first matching user
        }
        throw new Error('Invalid credentials'); // Handle invalid login
      }),
      catchError(() => {
        return throwError(() => new Error('Login failed')); // Handle API errors
      })
    );
  }

  setUser(user: any): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  getUser(): any {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user data. Clearing corrupted data:', error);
      localStorage.removeItem('user');
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
      localStorage.removeItem('user'); // Clear user data
      this.router.navigate(['']); // Navigate to the home page
      this.userSubject.next(null); // Emit a null value to indicate logged-out state
    }
  }
}

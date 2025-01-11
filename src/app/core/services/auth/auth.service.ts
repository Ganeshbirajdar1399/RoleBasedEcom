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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://ecom-db-json.onrender.com'; // Base API URL

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.getUser()
  );
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const queryParams = `?email=${email}&password=${password}`;
    return this.http.get<any[]>(`${this.apiUrl}/users${queryParams}`).pipe(
      map(([user]) => {
        if (user) {
          this.setUser(user);
          this.userSubject.next(user);
          alert(`${user.firstName} ${user.lastName} logged in successfully`);
          return user;
        }
        throw new Error('Invalid credentials');
      }),
      catchError(() => {
        alert('Login failed');
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}/users`, user).pipe(
      catchError((error) => {
        console.log('Error in adding users', error);
        return of(null as unknown as Users);
      })
    );
  }

  updateUser(updatedDetails: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${updatedDetails.id}`, updatedDetails);
  }

  DeletetData(id: string): Observable<Users> {
    return this.http.delete<Users>(`${this.apiUrl}/users/${id}`);
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

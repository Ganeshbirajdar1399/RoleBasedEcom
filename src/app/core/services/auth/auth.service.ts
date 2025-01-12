import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Users } from './users';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://ecom-db-json.onrender.com'; // Base API URL

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.getUser()
  );
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // login(email: string, password: string): Observable<any> {
  //   const loginData = { email, password }; // Send plain text password to the backend
  //   return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
  //     map((user) => {
  //       if (user) {
  //         this.setUser(user);
  //         this.userSubject.next(user);
  //         this.showSnackbar(
  //           `${user.firstName} ${user.lastName} logged in successfully`
  //         );
  //         return user;
  //       }
  //       throw new Error('Invalid credentials');
  //     }),
  //     catchError((error) => {
  //       this.showSnackbar('Login failed', 3000);
  //       return throwError(() => new Error('Login failed'));
  //     })
  //   );
  // }
  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?email=${email}`) // Fetch user by email
      .pipe(
        map((users) => {
          this.userSubject.next(users);
          if (users.length === 0) {
            throw new Error('User not found'); // No user with the provided email
          }

          const user = users[0]; // JSON Server returns an array with the matching user

          // Validate the password
          if (user.password !== password) {
            throw new Error('Invalid credentials'); // Password doesn't match
          }

          // Exclude the password before storing in session
          const { password: _, ...userWithoutPassword } = user;

          // Use setUser to store the user in session storage
          this.setUser(userWithoutPassword);

          // Notify success and return the user
          this.showSnackbar(
            `${userWithoutPassword.firstName} ${userWithoutPassword.lastName} logged in successfully`,
            3000
          );
          return userWithoutPassword;
        }),
        catchError((error) => {
          // Log the error for debugging
          console.error('Login error:', error);

          // Handle errors gracefully
          this.showSnackbar(
            'Login failed. Please check your credentials.',
            3000
          );
          return throwError(() => error);
        })
      );
  }

  // register(user: Users): Observable<Users> {
  //   return this.http.post<Users>(`${this.apiUrl}/register`, user).pipe(
  //     map((newUser) => {
  //       this.showSnackbar('User registered successfully', 3000);
  //       return newUser;
  //     }),
  //     catchError((error) => {
  //       this.showSnackbar('Registration failed', 3000);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  register(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}/users`, user).pipe(
      map((newUser) => {
        // this.showSnackbar('User registered successfully', 3000);
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

    // Exclude password from the user object to update session storage
    const { password, ...userWithoutPassword } = updatedUser;

    return this.http.put(url, updatedUser).pipe(
      map((response) => {
        // Update the session storage if the user being updated matches the logged-in user
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);

          if (currentUser.id === updatedUser.id) {
            sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
          }
        }

        return response;
      }),
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`; // Fetch user by ID
    return this.http.get<any>(url).pipe(
      map((user) => user),
      catchError((error) => {
        console.error('Error fetching user by ID:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUserData(id: string): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.delete(url);
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
  clearUser(): void {
    sessionStorage.removeItem('loggedInUser');
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || ''; // Use optional chaining
  }

  isLoggedIn(): boolean {
    return !!this.getUser(); // Return true if user exists
  }

  logout(): void {
    this.toastr
      .info('Are you sure you want logout?', 'Confirm Logout', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0, // Make the toast persistent until the user interacts with it
        extendedTimeOut: 0, // Keep the toast open until action
      })
      .onTap.pipe
      // Handle confirmation
      ()
      .subscribe({
        next: () => {
          this.toastr.success('Logout successful', 'Success');
          sessionStorage.removeItem('user'); // Clear user data
          this.router.navigate(['']); // Navigate to the home page
          this.userSubject.next(null); // Emit a null value to indicate logged-out state
        },
        error: () => {
          // Handle cancellation or interaction
          this.toastr.info('Product deletion canceled', 'Info');
        },
      });
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

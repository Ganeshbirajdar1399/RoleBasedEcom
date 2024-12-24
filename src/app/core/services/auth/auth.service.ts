import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000/users'

  constructor(private http:HttpClient) {}

  fetchUsers(): Observable<Users[]>{
   return this.http.get<Users[]>(this.apiUrl).pipe(
    catchError((error) => {
      console.log('Error fetching users:',error);
      return of([]);
    })
   )
  }

  register(user : Users): Observable<Users> {
    return this.http.post<Users>(this.apiUrl, user).pipe(
      catchError((error)=> {
        console.log('Error in adding users', error);
        return of(null as unknown as Users);
      })
    )
  }

}

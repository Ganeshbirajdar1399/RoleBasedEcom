import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetProductService {
apiUrl = 'http://localhost:3000/products'
  constructor( private http: HttpClient) { }

  fetchData():Observable<any>{
return this.http.get(this.apiUrl);
  }
}

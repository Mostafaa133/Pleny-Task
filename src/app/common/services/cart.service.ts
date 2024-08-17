import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private apiUrl = 'https://dummyjson.com/';

  constructor(private http: HttpClient) { }

  addToCart(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.apiUrl + 'carts/add', body, { headers: { 'Content-Type': 'application/json' } });
  }

  getUserCart(id: any): Observable<any> {
    return this.http.get(this.apiUrl + 'carts/user/' + id);
  }

}

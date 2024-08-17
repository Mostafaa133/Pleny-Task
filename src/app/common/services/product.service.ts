import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  noOfNumCart: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private apiUrl = 'https://dummyjson.com/';

  constructor(private http: HttpClient) { }

  getAllProducts(limit: string = '9', skip: string = '0'): Observable<any> {
    return this.http.get(this.apiUrl + `products?limit=${limit}&skip=${skip}`);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this.apiUrl + 'products/categories');
  }

  searchProduct(query: string, limit: string = '9', skip: string = '0'): Observable<any> {
    return this.http.get(this.apiUrl + `products/search?q=${query}&limit=${limit}&skip=${skip}`);
  }

  getProductsByCategory(category: string, limit: string = '9', skip: string = '0'): Observable<any> {
    return this.http.get(this.apiUrl + `products/category/${category}?limit=${limit}&skip=${skip}`);
  }

  addToCart(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.apiUrl + 'products/add', body, { headers: { 'Content-Type': 'application/json' } });
  }

}

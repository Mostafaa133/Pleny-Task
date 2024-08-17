import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userValidity: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  Loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private apiUrl = 'https://dummyjson.com/';

  constructor(private http: HttpClient) { }

  login(data: { username: string; password: string }): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(this.apiUrl + 'auth/login', body, { headers: { 'Content-Type': 'application/json' } });
  }

}

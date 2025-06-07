import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    console.log('Environment:', environment);
    console.log('API URL:', this.apiUrl);
  }

  //login, register and session handing
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          console.log('Token received and stored:', response.token);
          localStorage.setItem('authToken', response.token);

        }
      })
    );
  }




  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token);
    return token;

  }

  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);  //
      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }


  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;

    return expiration < new Date();
  }

  //getting data
  getAllEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entry/all`);
  }
  getTodaysEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entry/today`);
  }

  getUser(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/auth/user`, { headers });
  };

  //connect partner
  connectPartner(email: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/auth/connect-partner`, { partnerEmail: email }, { headers });
  }

  //adding posts
  addPost(message: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/entry`, { note: message }, { headers });
  }

}



import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${this.config.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, @Inject('CONFIG') private config: any) { console.log('${this.config.apiBaseUrl}') }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, { username, password }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim(); // Remove leading/trailing spaces
      if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length, cookie.length); // Return the value of the cookie
      }
    }
    return null;
  }


  // Decode the JWT payload
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // The payload is the second part of the token
      return JSON.parse(atob(payload)); // Decode the base64-encoded payload and parse it
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  // Get the logged-in user by decoding the token from cookies
  getLoggedInUser() {
    const token = this.getCookie('token');
    console.log("this is ", token);
    // Assuming the token is stored in a cookie named 'token'
    if (token) {
      const decodedToken = this.decodeToken(token);
      console.log("decoded token ", decodedToken);

      return decodedToken;
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp) {
      const expiryDate = new Date(decodedToken.exp * 1000); // Convert exp to milliseconds
      return expiryDate < new Date(); // Check if the current date is past the expiry date
    }
    return true; // Treat token as expired if decoding fails
  }

  register(username: string, role: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, role, password }, { withCredentials: true });
  }
  // Method to update user details
  updateUserProfile(data: { userId: string; username: string; password?: string }) {
    const token = this.getCookie('token');
    console.log("tokennnn", token);
    // Adjust if you're using cookies
    return this.http.put(`${this.apiUrl}/updateUserDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  checkInitialization(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkinit`, {}, { withCredentials: true });
  }

  initializeapp(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initializeapp`, { username, password }, { withCredentials: true });
  }
}

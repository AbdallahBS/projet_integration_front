import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admins';  // Replace with your actual backend API endpoint

  constructor(private http: HttpClient) {}


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

  getAllAdmins(): Observable<Admin[]> {
    const token = this.getLoggedInUser();
    const adminId =  token.userId;  // Use userId from the token
  console.log("this is the admin id " , adminId);
  
    return this.http.get<Admin[]>(`${this.apiUrl}?excludeId=${adminId}`);
  }

  addAdmin(adminData: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.apiUrl, adminData);
  }

  updateAdmin(adminId: string, adminData: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${adminId}`, adminData);
  }

  deleteAdmin(adminId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${adminId}`);
  }
}

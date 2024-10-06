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

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
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

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Historique {
  id: number;
  adminId: string;
  role: string;
  typeofaction: string;
  time: string;
  admin: {
    id: string;
    username: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = `${this.config.apiBaseUrl}/api`; // Replace with your backend URL

  constructor(private http: HttpClient, @Inject('CONFIG') private config: any) { }

  // Fetch total number of students
  getDashboardCounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }
  getHistorique(): Observable<Historique[]> {
    return this.http.get<Historique[]>(this.baseUrl + "/historique");
  }


}

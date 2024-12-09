// src/app/services/eleve.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../models/eleve.model'; // Ensure you have an Eleve model
export interface Student {
  id: string;
  nom: string;
  prenom: string;
  attendances: {
    attendanceStatus: string;
  }[];
  sexe: string;
  classeId: string;
}
@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = `${this.config.apiBaseUrl}/eleve/eleves`; // Update the port as needed

  constructor(private http: HttpClient, @Inject('CONFIG') private config: any) { }


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
  // Fetch students by niveau
  getStudentsByNiveau(niveau: string): Observable<Student[]> {
    return this.http.get<Student[]>(`http://localhost:3000/eleve/niveau/${niveau}`);
  }

  getAllEleves(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(this.apiUrl);
  }
  addEleve(eleveData: any): Observable<Eleve> {
    const token = this.getLoggedInUser();


    const payload = {
      eleve: eleveData, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };

    console.log("-------", payload);
    return this.http.post<Eleve>(this.apiUrl, payload);
  }
  deleteEleve(eleveId: number): Observable<void> {
    const token = this.getLoggedInUser();
    const headers = new HttpHeaders({
      'adminId': token.userId,   // Use userId from the token
      'adminRole': token.userRole // Use userRole from the token
    });
    return this.http.delete<void>(`${this.apiUrl}/${eleveId}`, { headers });
  }
  /**updateEleve(id: number, eleve: Eleve): Observable<Eleve> {
    const token = this.getLoggedInUser();
    const payload = {
      ...eleve, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };
    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, payload);**/
  updateEleve(id: number, eleveData: any): Observable<Eleve> {

    const token = this.getLoggedInUser();

    const payload = {
      eleve: eleveData, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };

    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, payload);
  }

}

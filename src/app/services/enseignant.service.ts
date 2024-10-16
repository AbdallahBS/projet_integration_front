import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enseignant } from '../models/enseignant.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnseignantService {
  private apiUrl = 'http://localhost:3000/enseignants/enseignants'; // Adjust API URL as needed

  constructor(private http: HttpClient) { }
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

  getAllEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  getEnseignantById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  addEnseignant(enseignantData: Enseignant): Observable<{ message: string, enseignant: Enseignant }> {
    const token = this.getLoggedInUser();
    
    console.log(token);
    const payload = {
      ...enseignantData, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };
    return this.http.post<{ message: string, enseignant: Enseignant }>(this.apiUrl, payload);
  }

  updateEnseignant(id: number, enseignantData: Enseignant): Observable<void> {
    const token = this.getLoggedInUser();
    const payload = {
      ...enseignantData, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEnseignant(id: number): Observable<void> {
    const token = this.getLoggedInUser();
    const headers = new HttpHeaders({
      'adminId': token.userId,   // Use userId from the token
      'adminRole': token.userRole // Use userRole from the token
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}` , {headers});
  }
}

// class.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from  '../models/class.model'; // Create a model for Class

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'http://localhost:3000/classe'; // Your API endpoint

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
  getAllClasses(): Observable<{ message: string; classes: Class[] }> {
    return this.http.get<{ message: string; classes: Class[] }>(this.apiUrl+'/classes');
  }
  getAllClassesDetails(): Observable<{ message: string; classes: Class[] }> {
    return this.http.get<{ message: string; classes: Class[] }>(this.apiUrl+'/classesDetail');
  }

  getClassesByNiveau(niveau: string): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/classes/niveau/${niveau}`);
  }

  deleteClass(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/classes/${id}`);
  }
  addClass(classData: { nomDeClasse: string; niveau: string }): Observable<any> {
    const token = this.getLoggedInUser();
console.log("hmmmm",token.userId);

    const payload = {
      
      ...classData, // Spread the eleve data
      adminId: token.userId, // Use userId from the token
      adminRole: token.userRole // Use userRole from the token
    };
    
    return this.http.post(this.apiUrl+'/classes', payload);
  }

  updateClass(id: string, classData: Class): Observable<any> {
    return this.http.put(`${this.apiUrl}/classes/${id}`, classData);
  }
  
}

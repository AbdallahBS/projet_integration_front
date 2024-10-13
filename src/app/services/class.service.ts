// class.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class } from  '../models/class.model'; // Create a model for Class

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'http://localhost:3000/classe/classes'; // Your API endpoint

  constructor(private http: HttpClient) {}

  getAllClasses(): Observable<{ message: string; classes: Class[] }> {
    return this.http.get<{ message: string; classes: Class[] }>(this.apiUrl);
  }

  getClassesByNiveau(niveau: string): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/niveau/${niveau}`);
  }
}

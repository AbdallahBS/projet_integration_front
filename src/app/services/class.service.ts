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
    return this.http.post(this.apiUrl+'/classes', classData);
  }

  updateClass(id: string, classData: Class): Observable<any> {
    return this.http.put(`${this.apiUrl}/classes/${id}`, classData);
  }
  
}

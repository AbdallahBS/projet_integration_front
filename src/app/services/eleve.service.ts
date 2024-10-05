// src/app/services/eleve.service.ts

import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../models/eleve.model'; // Ensure you have an Eleve model

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = 'http://localhost:3000/eleve/eleves'; // Update the port as needed

  constructor(private http: HttpClient) {}

  getAllEleves(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(this.apiUrl);
  }
  addEleve(eleve: Eleve): Observable<Eleve> {
    return this.http.post<Eleve>(this.apiUrl, eleve);
  }
  deleteEleve(eleveId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eleveId}`);
  }
  updateEleve(id: number, eleve: Eleve): Observable<Eleve> {
    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, eleve);
  }
 
}

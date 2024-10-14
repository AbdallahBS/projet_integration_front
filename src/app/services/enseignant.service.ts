import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enseignant } from '../models/enseignant.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnseignantService {
  private apiUrl = 'http://localhost:3000/enseignants/enseignants'; // Adjust API URL as needed

  constructor(private http: HttpClient) { }

  getAllEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  getEnseignantById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  addEnseignant(enseignantData: Enseignant): Observable<{ message: string, enseignant: Enseignant }> {
    return this.http.post<{ message: string, enseignant: Enseignant }>(this.apiUrl, enseignantData);
  }

  updateEnseignant(id: number, enseignantData: Enseignant): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, enseignantData);
  }

  deleteEnseignant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

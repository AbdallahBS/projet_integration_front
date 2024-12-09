// src/app/services/eleve.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Level } from '../models/level.model'; // Ensure you have an Eleve model

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject('CONFIG') private config: any) {
    this.apiUrl = `${this.config.apiBaseUrl}/level/levels`;
  }

  getAllLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(this.apiUrl);
  }
  addLevel(Level: Level): Observable<Level> {
    return this.http.post<Level>(this.apiUrl, Level);
  }
  deleteLevel(levelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${levelId}`);
  }
  updateLevel(id: number, level: Level): Observable<Level> {
    return this.http.put<Level>(`${this.apiUrl}/${id}`, level);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtudeService {
  private apiUrl = 'http://localhost:3000/api/etudes';

  constructor(private http: HttpClient) {}
  getEtudes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  // Method to submit the data to the API
  submitEtudeData(
    className: string,
    timeFrom: string,
    timeTo: string,
    teacherId: string,
    matiere: string,
    seanceDates: string[]
  ): Observable<any> {
    const payload = {
      niveau: className,
      startTime: timeFrom,
      endTime: timeTo,
      enseignantId: teacherId,
      matiere: matiere,
      seanceDates: seanceDates,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }
}

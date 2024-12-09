import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtudeService {
  private apiUrl = `${this.config.apiBaseUrl}/api/etudes`;

  constructor(private http: HttpClient, @Inject('CONFIG') private config: any) { }
  getEtudes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  markAttendance(etudeId: string, seanceId: string, attendanceData: { attendance: any[] }): Observable<any> {
    const url = `http://localhost:3000/api/etudes/${etudeId}/seances/${seanceId}/attendance`;
    return this.http.post(url, attendanceData);
  }
  getElevesFromEtude(etudeId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/etudes/${etudeId}/eleves`);
  }

  addElevesToEtude(etudeId: string, eleveIds: string[]): Observable<any> {
    const url = 'http://localhost:3000/api/addeleves';
    const body = { etudeId, eleveIds };
    return this.http.post(url, body);
  }
  removeStudentFromEtude(etudeId: string, studentId: string) {
    const url = `${this.apiUrl}/${etudeId}/eleves/${studentId}`;
    return this.http.delete(url);
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

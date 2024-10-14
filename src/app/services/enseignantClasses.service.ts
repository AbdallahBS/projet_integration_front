import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EnseignantClasses } from '../models/enseignantClasses.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EnseignantClassesService {

    private apiUrl = 'http://localhost:3000/enseignantClasse'; // Adjust API URL as needed

    constructor(private http: HttpClient) { }

    addEnseignantClasses(enseignantId: string, classes: Array<{ classe: string, matiere: string }>): Observable<any> {
        console.log("last call: ",{ enseignantId, classes });
        return this.http.post(`${this.apiUrl}/enseignantClasses`, { enseignantId, classes }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
};
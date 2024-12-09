import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EnseignantClasses } from '../models/enseignantClasses.model';
import { catchError, map } from 'rxjs/operators';
import { Enseignant } from '../models/enseignant.model';

@Injectable({
    providedIn: 'root',
})
export class EnseignantClassesService {

    private apiUrl = `${this.config.apiBaseUrl}/enseignantClasse`; // Adjust API URL as needed

    constructor(private http: HttpClient, @Inject('CONFIG') private config: any) { }

    addEnseignantClasses(enseignantId: string, classes: Array<{ classe: string, matiere: string }>): Observable<any> {
        console.log("last call: ", { enseignantId, classes });
        return this.http.post(`${this.apiUrl}/enseignantClasses`, { enseignantId, classes }).pipe(
            catchError(this.handleError)
        );
    }

    updateEnseignantClasses(enseignantId: string, enseignantData: Enseignant): Observable<any> {
        return this.http.put(`${this.apiUrl}/enseignantClasses/${enseignantId}`, { enseignantData });
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
};
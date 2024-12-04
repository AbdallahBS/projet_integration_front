import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./gestionetude.component').then(m => m.GestionetudeComponent),
    data: {
      title: ` / إدارة حصص التدارك`
    }
  }
];


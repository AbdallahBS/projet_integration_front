import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./gestionenseignant.component').then(m => m.GestionenseignantComponent),
    data: {
      title: `إدارة المدرسين`
    }
  }
];


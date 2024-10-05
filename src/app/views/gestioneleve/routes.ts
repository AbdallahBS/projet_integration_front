import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./gestioneleve.component').then(m => m.GestioneleveComponent),
    data: {
      title: ` إدارة التلاميد`
    }
  }
];


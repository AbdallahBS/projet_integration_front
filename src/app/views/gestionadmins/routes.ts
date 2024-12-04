import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./gestionadmins.component').then(m => m.GestionadminsComponent),
    data: {
      title: ` / إدارة المديرين`
    }
  }
];


import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./gestion-level.component').then(m => m.LevelComponent),
    data: {
      title: `إدارة الأقسام`
    }
  }
];


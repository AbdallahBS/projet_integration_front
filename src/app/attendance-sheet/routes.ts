import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./attendance-sheet.component').then(m => m.AttendanceSheetComponent),
    data: {
      title: ` / رزنامة حصص التدارك `
    }
  }
];


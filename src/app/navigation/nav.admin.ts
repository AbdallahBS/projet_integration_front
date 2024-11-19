// src/app/navigation/nav.admin.ts
import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'لوحة التحكم',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'إدارة المدرسين',
    url: '/gestionenseignant',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'إدارة الأقسام',
    url: '/gestion-level',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'إدارة التلاميذ',
    url: '/gestioneleve',
    iconComponent: { name: 'cil-cursor' },
  },
  {
    name: 'إدارة حصص التدارك',
    url: '/gestionetude',
    iconComponent: { name: 'cil-cursor' },
  },


  
  {
    name: 'رزنامة حصص التدارك',
    url: '/attendancesheet',
    iconComponent: { name: 'cil-menu' },
  },
];

import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'لوحة التحكم',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },

  },


  {
    name: 'الإعدادات العامة',
    title: true
  },
  {
    name: 'إدارة المديرين',
    url: '/gestionadmins',
    iconComponent: { name: 'cil-notes' },

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
    iconComponent: { name: 'cil-menu' },
  },

  {
    name: 'رزنامة حصص التدارك',
    url: '/attendancesheet',
    iconComponent: { name: 'cil-menu' },
  },



];

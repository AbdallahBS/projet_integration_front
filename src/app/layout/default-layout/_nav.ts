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
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    
  },
  {
    name: 'إدارة المدرسين',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
   
  },
  {
    name: 'إدارة التلاميذ',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
   
  },

  
];

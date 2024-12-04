// nav.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.services'; // Adjust path as necessary
import { INavData } from '@coreui/angular'; // Make sure to import this if you're using INavData
import { navItems } from '../../app/layout/default-layout/_nav'; // Adjust path as necessary

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private navItems: INavData[] = [
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
      iconComponent: { name: 'cil-people' },
    },
    {
      name: 'إدارة المدرسين',
      url: '/gestionenseignant',
      iconComponent: { name: 'cil-puzzle' },
    },
    {
      name: 'إدارة التلاميذ',
      url: '/gestioneleve',
      iconComponent: { name: 'cil-cursor' },
    },
    
  {
    name: 'رزنامة حصص التدارك',
    url: '/attendancesheet',
    iconComponent: { name: 'cil-menu' },
  },
  ];

  constructor(private authService: AuthService) {}

  getNavItems() {
    const user = this.authService.getLoggedInUser(); // Retrieve the logged-in user
    let filteredNavItems = this.navItems; // Default to all items

    if (user && user.userRole === 'admin') {
      // If user is admin, filter out admin-specific items
      filteredNavItems = this.navItems.filter(item => item.name !== 'إدارة المديرين'); // Adjust based on actual nav item names
    }

    return filteredNavItems;
  }
}

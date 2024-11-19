import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'الصفحة الرئيسية'
    },
    children: [

      {
        path: 'dashboard',
        // canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },

      {
        path: 'gestionenseignant',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/gestionenseignant/routes').then((m) => m.routes)
      },
      {
        path: 'gestionadmins',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/gestionadmins/routes').then((m) => m.routes)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/profile/routes').then((m) => m.routes)
      },
      {
        path: 'gestion-level',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/gestion-level/routes').then((m) => m.routes)
      },
      {
        path: 'gestioneleve',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/gestioneleve/routes').then((m) => m.routes)
      },

      {
        path: 'attendancesheet',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./attendance-sheet/routes').then((m) => m.routes)
      },
      {
        path: 'gestionetude',
        canActivate: [AuthGuard],// Protect the dashboard route

        loadChildren: () => import('./views/gestionetude/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      }, 
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'initialization',
    loadComponent: () => import('./views/pages/initialization/initialization.component').then(m => m.InitializationComponent),
    data: {
      title: 'Initialization Page'
    }
  },

  { path: '**', redirectTo: 'dashboard' }
];

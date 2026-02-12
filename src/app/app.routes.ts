import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'upload',
    pathMatch: 'full',
  },
  {
    path: 'upload',
    loadComponent: () => import('@pages/upload-page/upload-page').then((m) => m.UploadPage),
    title: 'Cargar Nómina - Confuturo',
  },
  {
    path: 'status',
    loadComponent: () => import('@pages/status-page/status-page').then((m) => m.StatusPage),
    title: 'Estado de Nóminas - Confuturo',
  },
  {
    path: 'refunds', // Nueva ruta habilitada
    loadComponent: () => import('@pages/refunds-page/refunds-page').then((m) => m.RefundsPage),
    title: 'Rendiciones - Confuturo',
  },
  // Fallback
  {
    path: '**',
    redirectTo: 'upload',
  },
];

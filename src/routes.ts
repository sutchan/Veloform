// src/routes.ts v3.2.0
import { Routes } from '@angular/router';
import { RenderMode } from '@angular/ssr';

export const appRoutes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app/app').then(m => m.App),
    title: 'Veloform - Bike Configurator'
  },
  { 
    path: 'config/:id', 
    loadComponent: () => import('./app/app').then(m => m.App),
    title: 'Veloform - Configuration',
    data: { renderMode: RenderMode.Server }
  }
];

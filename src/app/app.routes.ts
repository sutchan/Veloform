// src/app/app.routes.ts v3.2.0
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app').then(m => m.App),
    title: 'Veloform - Bike Configurator'
  },
  { 
    path: 'config/:id', 
    loadComponent: () => import('./app').then(m => m.App),
    title: 'Veloform - Configuration'
  }
];

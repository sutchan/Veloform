// src/app/app.routes.ts v3.2.0
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app').then(m => m.App),
    title: 'Veloform - Bike Configurator'
  }
  // Note: Dynamic route /config/:id is handled client-side via Router
  // To enable sharing, users can copy the config ID from the URL after saving
];

import { Routes } from '@angular/router';
import {SupportComponent} from './components/support/support.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'resume-builder', loadChildren: () => import('./components/emp-resume-builder/emp-resume-builder.module').then(m => m.EmpResumeBuilderModule) },
  { path: 'support', component: SupportComponent },
  { path: '403', loadChildren: () => import('./components/forbidden/forbidden.module').then(m => m.ForbiddenModule) },
  { path: '**', redirectTo: '403' }
];

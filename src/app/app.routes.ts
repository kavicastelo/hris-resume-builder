import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '403', pathMatch: 'full' },
  { path: 'resume-builder', loadChildren: () => import('./components/emp-resume-builder/emp-resume-builder.module').then(m => m.EmpResumeBuilderModule) },
  { path: '403', loadChildren: () => import('./components/forbidden/forbidden.module').then(m => m.ForbiddenModule) },
  { path: '**', redirectTo: '403' }
];

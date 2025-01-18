import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpResumeBuilderComponent } from './emp-resume-builder.component';

const routes: Routes = [{ path: '', component: EmpResumeBuilderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpResumeBuilderRoutingModule { }

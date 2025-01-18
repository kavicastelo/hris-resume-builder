import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpResumeBuilderRoutingModule } from './emp-resume-builder-routing.module';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
    imports: [
        CommonModule,
        EmpResumeBuilderRoutingModule,
        ReactiveFormsModule
    ]
})
export class EmpResumeBuilderModule { }

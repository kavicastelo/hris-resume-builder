import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterRoutingModule } from './footer-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    FooterRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FooterModule { }

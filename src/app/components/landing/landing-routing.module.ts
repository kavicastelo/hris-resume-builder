import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LandingComponent} from "./landing.component";

const routes: Routes = [{path: '', component: LandingComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}

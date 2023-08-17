import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCanActive } from './guards/admin.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
    canActivate: [AdminCanActive]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

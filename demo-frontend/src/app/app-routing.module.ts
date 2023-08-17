import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth/auth.gaurd';

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((module) => module.AuthModule),
  },
  {
    path: "user",
    loadChildren: () => import("./user/user.module").then((module) => module.UserModule),
    canLoad: [AuthGaurd],
  },
  {
    path: "",
    pathMatch: "full",
    loadChildren: () => import("./posts/posts.module").then((module) => module.PostsModule),
  },
  {
    path: "posts",
    loadChildren: () => import("./posts/posts.module").then((module) => module.PostsModule),
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then((module) => module.AdminModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

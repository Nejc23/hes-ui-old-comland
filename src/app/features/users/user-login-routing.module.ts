import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login.component';
import { NgModule } from '@angular/core';

export const UserLoginRoutes: Routes = [
  {
    path: 'login',
    component: UserLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(UserLoginRoutes)],
  exports: [RouterModule]
})
export class UserLoginRoutingModule {}

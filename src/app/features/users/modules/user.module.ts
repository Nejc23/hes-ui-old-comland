import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserLoginRoutingModule } from '../user-login-routing.module';
import { UserLoginComponent } from '../user-login.component';
import { UsersComponent } from '../components/users.component';
import { UsersSearchComponent } from '../components/users-search.component';
import { UserEditComponent } from '../components/user-edit/user-edit.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserLoginComponent, UsersComponent, UsersSearchComponent, UserEditComponent],
  imports: [CommonModule, SharedModule, UserLoginRoutingModule, UserRoutingModule],
  exports: [UserLoginComponent]
})
export class UserModule {}

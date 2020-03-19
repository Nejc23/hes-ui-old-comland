import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserLoginRoutingModule } from '../user-login-routing.module';
import { UserLoginComponent } from '../user-login.component';

@NgModule({
  declarations: [UserLoginComponent],
  imports: [CommonModule, SharedModule, UserLoginRoutingModule],
  exports: [UserLoginComponent]
})
export class UserModule {}

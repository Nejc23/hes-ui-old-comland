import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AppStoreService } from '../../../core/stores/services/app-store.service';
import { AppState } from '../../../core/stores/interfaces/app-state.interface';
import { Observable } from 'rxjs';
import { ModalChangePasswordComponent } from '../../modals/components/modal-change-password.component';
import { ModalService } from '../../modals/services/modal.service';

@Component({
  selector: 'app-user-logged-info',
  templateUrl: './user-logged-info.component.html'
})
export class UserLoggedInfoComponent implements OnInit {
  userFullName: string;

  constructor(private authService: AuthService, private modalService: ModalService, private appStore: AppStoreService) {}

  ngOnInit() {
    const user: Observable<AppState> = this.appStore.stateObservable;
    user.subscribe(value => {
      if (value.user != null) {
        this.userFullName = value.user.firstName + ' ' + value.user.lastName;
      }
    });
  }

  changePassword($event: any) {
    const modalRef = this.modalService.open(ModalChangePasswordComponent);
    modalRef.result.then().catch(() => {});
  }

  logout($event: any) {
    this.authService.logout();
  }
}

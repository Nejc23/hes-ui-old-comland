import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { UserForm } from '../../models/user-form.model';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { UserRepository } from 'src/app/core/repository/interfaces/users/user-repository.interface';
import { UsersRepositoryService } from 'src/app/core/repository/services/users/users-repository.service';
import { UsersService } from '../../services/users.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/core/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  userId = 0;
  data: UserRepository = new UserForm();

  accessTypes$: Observable<Codelist<number>[]>;

  successMessageSave = $localize`User saved`;

  constructor(
    private sidebarService: SidebarService,
    private usersRepository: UsersRepositoryService,
    private codelistRepository: CodelistRepositoryService,
    private service: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private formUtils: FormsUtilsService,
    public toastService: ToastNotificationService
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId !== 0) {
      this.sidebarService.headerTitle = $localize`Edit user`;
    } else {
      this.sidebarService.headerTitle = $localize`New user`;
    }
    this.form = this.service.createForm(this.data);
  }

  get formFunctionality() {
    return FunctionalityEnumerator.users;
  }

  ngOnInit() {
    this.accessTypes$ = this.codelistRepository.accesssTypeCodelist();
    this.getData();
  }

  private getData() {
    if (this.userId) {
      this.usersRepository.getUser(this.userId).subscribe((response: UserRepository) => {
        this.data = response;
        this.form = this.service.createForm(this.data);
      });
    }
  }

  get firstNameProperty() {
    return nameOf<UserRepository>(x => x.firstName);
  }

  get lastNameProperty() {
    return nameOf<UserRepository>(x => x.lastName);
  }

  get userNameProperty() {
    return nameOf<UserRepository>(x => x.userName);
  }

  get emailProperty() {
    return nameOf<UserRepository>(x => x.email);
  }

  get accessTypeIdProperty() {
    return nameOf<UserRepository>(x => x.accessTypeId);
  }

  get gsmNumberProperty() {
    return nameOf<UserRepository>(x => x.gsmNumber);
  }

  get officeNumberProperty() {
    return nameOf<UserRepository>(x => x.officeNumber);
  }

  /* canSubmit(form: FormGroup): boolean {
    return form && form.valid;
  }*/

  onSaveClicked() {
    let request: any = null;

    if (this.userId === 0) {
      request = this.usersRepository.createUser(this.form.value);
    } else {
      request = this.usersRepository.saveUser(this.userId, this.form.value);
    }

    this.formUtils.saveForm(this.form, request, this.successMessageSave).subscribe(
      (response: UserRepository) => {
        this.data = response;
        this.form = this.service.createForm(this.data);
        this.router.navigate(['users']);
      },
      () => {}
    );
  }
}

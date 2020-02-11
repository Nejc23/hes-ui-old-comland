import { Injectable } from '@angular/core';
import { UserRepository } from 'src/app/core/repository/interfaces/users/user-repository.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersSearchFilter } from '../interfaces/user-list.interface';
import { UsersListRepository } from 'src/app/core/repository/interfaces/users/user-list-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private formBuilder: FormBuilder) {}

  createForm(data: UserRepository): FormGroup {
    return this.formBuilder.group({
      [nameOf<UserRepository>(x => x.id)]: [data.id],
      [nameOf<UserRepository>(x => x.firstName)]: [data.firstName, Validators.required],
      [nameOf<UserRepository>(x => x.lastName)]: [data.lastName, Validators.required],
      [nameOf<UserRepository>(x => x.userName)]: [data.userName, Validators.required],
      [nameOf<UserRepository>(x => x.email)]: [data.email, [Validators.required, Validators.email]],
      [nameOf<UserRepository>(x => x.accessTypeId)]: [data.accessTypeId, Validators.required],
      [nameOf<UserRepository>(x => x.gsmNumber)]: [data.gsmNumber],
      [nameOf<UserRepository>(x => x.officeNumber)]: [data.officeNumber]
    });
  }

  search(formValue: UsersSearchFilter, rows: UsersListRepository[]) {
    const selectedOption = rows.filter(item => {
      if (
        (item.firstName && item.firstName.toLowerCase().indexOf(formValue.content.toLowerCase()) >= 0) ||
        (item.lastName && item.lastName.toLowerCase().indexOf(formValue.content.toLowerCase()) >= 0) ||
        (item.userName && item.userName.toLowerCase().indexOf(formValue.content.toLowerCase()) >= 0) ||
        (item.email && item.email.toLowerCase().indexOf(formValue.content.toLowerCase()) >= 0) ||
        (item.accessTypeName && item.accessTypeName.toLowerCase().indexOf(formValue.content.toLowerCase()) >= 0)
      ) {
        return true;
      }
      return false;
    });

    return selectedOption;
  }
}

import { UserRepository } from 'src/app/core/repository/interfaces/user-repository.interface';

export class UserForm implements UserRepository {
  id = null;
  firstName = null;
  lastName = null;
  userName = null;
  email = null;
  accessTypeId = null;
  gsmNumber = null;
  officeNumber = null;
}

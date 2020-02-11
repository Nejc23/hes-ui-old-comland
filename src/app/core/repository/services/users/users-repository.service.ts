import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { RepositoryService } from '../../services/repository.service';
import { UsersListRepository } from '../../interfaces/user-list-repository.interface';
import { UserRepository } from '../../interfaces/user-repository.interface';
import { usersEndpointUrl } from '../../consts/users-endpoint-url.const';

@Injectable({
  providedIn: 'root'
})
export class UsersRepositoryService {
  constructor(private repository: RepositoryService) {}

  getUsersList(): Observable<UsersListRepository[]> {
    return this.repository.makeRequest(this.getUsersListRequest());
  }
  getUsersListRequest(): HttpRequest<UsersListRepository[]> {
    return new HttpRequest('GET', usersEndpointUrl);
  }

  getUser(id: number): Observable<UserRepository> {
    return this.repository.makeRequest(this.getUserRequest(id));
  }
  getUserRequest(id: number): HttpRequest<UserRepository> {
    return new HttpRequest('GET', `${usersEndpointUrl}/${id}`);
  }

  saveUser(id: number, payload: UserRepository): Observable<UserRepository> {
    return this.repository.makeRequest(this.saveUserRequest(id, payload));
  }
  saveUserRequest(id: number, payload: UserRepository): HttpRequest<UserRepository> {
    return new HttpRequest('PUT', `${usersEndpointUrl}/${id}`, payload as UserRepository);
  }

  createUser(payload: UserRepository): Observable<UserRepository> {
    return this.repository.makeRequest(this.createUserRequest(payload));
  }
  createUserRequest(payload: UserRepository): HttpRequest<UserRepository> {
    return new HttpRequest('POST', `${usersEndpointUrl}`, payload as UserRepository);
  }

  deleteUser(id: number): Observable<any> {
    return this.repository.makeRequest(this.deleteUserRequest(id));
  }
  deleteUserRequest(id: number): HttpRequest<any> {
    return new HttpRequest('DELETE', `${usersEndpointUrl}/${id}`);
  }
}

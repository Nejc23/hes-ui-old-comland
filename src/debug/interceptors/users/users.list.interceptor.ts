import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { UsersListRepository } from 'src/app/core/repository/interfaces/user-list-repository.interface';

@Injectable()
export class UsersListInterceptor {
  constructor() {}

  static interceptUsersList(): Observable<HttpEvent<any>> {
    const data: UsersListRepository[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        userName: 'JohnJ',
        email: 'john.doe@company.com',
        accessTypeName: 'super user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 2,
        firstName: 'Adams',
        lastName: 'Smith',
        userName: 'SmithA',
        email: 'adams.smith@company.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 3,
        firstName: 'Baker',
        lastName: 'Johnson',
        userName: 'BakerJ',
        email: 'baker.johnson@company.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 4,
        firstName: 'Edward',
        lastName: 'Ellison',
        userName: 'EllisonE',
        email: 'Edward.Ellison@Kunde-Feil.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 5,
        firstName: 'Jason',
        lastName: 'Short',
        userName: 'ShortJ',
        email: 'Jason.Short@Kunde-Feil.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 6,
        firstName: 'Joseph',
        lastName: 'Kerr',
        userName: 'KerrJ',
        email: 'Joseph.Kerr@Kunde-Feil.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 7,
        firstName: 'Kevin',
        lastName: 'Metcalfe',
        userName: 'MetcalfeKv',
        email: 'Kevin.Metcalfe@Spinka.com',
        accessTypeName: 'super user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 8,
        firstName: 'Stephanie',
        lastName: 'McLean',
        userName: 'McLeanSteph',
        email: 'Stephanie.McLean@Spinka.com',
        accessTypeName: 'super user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 9,
        firstName: 'Rose',
        lastName: 'May',
        userName: 'MayRose',
        email: 'Rose.May@Spinka.com',
        accessTypeName: 'user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 10,
        firstName: 'Lisa',
        lastName: 'Paterson',
        userName: 'PatersonLis',
        email: 'Lisa.Paterson@Bode-lc.com',
        accessTypeName: 'super user',
        lastChange: '2019-12-20T04:03:32'
      },
      {
        id: 11,
        firstName: 'Anthony',
        lastName: 'McLean',
        userName: 'McLeanAn',
        email: 'Anthony.McLean@Spinka.com',
        accessTypeName: 'super user',
        lastChange: '2019-12-20T04:03:32'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptUsersList(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users$`).test(request.url) && request.method.endsWith('GET');
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { schedulerJobs } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';

@Injectable()
export class SchedulerJobsInterceptor {
  constructor() {}

  static interceptSchedulerJobsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: SchedulerJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        description: 'Daily read of 15 min energy (A+)',
        nextRun: 'In 15 minutes',
        owner: 'Jan Benedičič'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 30 minutes',
        owner: 'Miha Galičič'
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 18 hours',
        owner: 'Jan Benedičič'
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Miha Galičič'
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Jan Benedičič'
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        active: false,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 3 days',
        owner: 'Miha Galičič'
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 5 days',
        owner: 'Jan Benedičič'
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        active: false,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 7 days',
        owner: 'Miha Galičič'
      }
    ];

    let skip = 0;
    let take = 0;
    let sortColId = '';
    let sortedJobs = []; // data;
    let searched = data;
    if (request.body) {
      const params = request.body as GridRequestParams;
      if (params.searchModel && params.searchModel.length > 0) {
        searched = searchById(data, params.searchModel[0].value);
      }

      skip = params.startRow;
      take = params.endRow;

      if (params.sortModel) {
        if (params.sortModel.length > 0) {
          params.sortModel.forEach(element => {
            sortColId = element.colId;

            if (element.sort === 'desc') {
              sortedJobs = _.sortBy(searched, sortColId).reverse();
            } else {
              sortedJobs = _.sortBy(searched, sortColId);
            }
          });
        } else {
          sortedJobs = searched;
        }
      }
    }

    const body: GridResponse<SchedulerJobsList> = {
      data: sortedJobs.slice(skip, take), // sortedUsers.slice(request.body.startRow, request.body.endRow),
      totalCount: searched.length,
      summary: '',
      groupCount: 0
    };

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptSchedulerJobsList(request: HttpRequest<any>): boolean {
    return new RegExp(schedulerJobs).test(request.url) && request.method.endsWith('POST');
  }
}

function searchById(companies, filter) {
  let result;
  if (typeof filter === 'undefined' || filter.length === 0) {
    result = companies;
  } else {
    result = _.filter(companies, c => {
      const cProperties = _.keys(c);
      _.pull(cProperties, 'id');
      return _.find(cProperties, property => {
        if (c[property]) {
          return _.includes(_.lowerCase(c[property]), _.lowerCase(filter));
        }
      });
    });
  }
  return result;
}

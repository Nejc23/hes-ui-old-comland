import { IActionRequestParams } from './../../../app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { MeterUnitsList } from 'src/app/core/repository/interfaces/meter-units/meter-units-list.interface';
import { meterUnits } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitsListInterceptor {
  constructor() {}

  static interceptMeterUnitsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitsList[] = setData();
    let skip = 0;
    let take = 0;
    let sortColId = '';
    let sortedUsers = []; // data;
    let searched = data;

    if (request.body) {
      const params = request.body as IActionRequestParams;
      if (params.textSearch && params.textSearch.value.length > 0) {
        searched = searchById(data, params.textSearch.value);
      }

      skip = (params.pageNumber - 1) * params.pageSize; // params.startRow;
      take = skip + params.pageSize; // params.endRow;

      sortedUsers = searched;

      if (params.sort) {
        params.sort.forEach((element) => {
          sortColId = element.propName;

          if (element.sortOrder === 'desc') {
            sortedUsers = _.sortBy(searched, sortColId).reverse();
          } else {
            sortedUsers = _.sortBy(searched, sortColId);
          }
        });
      }
    }

    const body: GridResponse<MeterUnitsList> = {
      data: sortedUsers.slice(skip, take), // sortedUsers.slice(request.body.startRow, request.body.endRow),
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

  static canInterceptMeterUnitsList(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnits + `$`).test(request.url) && request.method.endsWith('POST');
  }
}

function searchById(companies, filter) {
  let result;
  if (typeof filter === 'undefined' || !filter || filter.length === 0) {
    result = companies;
  } else {
    result = _.filter(companies, (c) => {
      const cProperties = _.keys(c);
      _.pull(cProperties, 'id');
      return _.find(cProperties, (property) => {
        if (c[property]) {
          return _.includes(_.lowerCase(c[property]), _.lowerCase(filter));
        }
      });
    });
  }
  return result;
}

function setData(): MeterUnitsList[] {
  return [
    {
      deviceId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      status: 'Active',
      name: 'Cubis PLC temp 520',
      readStatusTimeStamp: '2020-01-03T05:32:32',
      readStatusColor: 'red',
      vendor: 'Landis+Gy',
      tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
      disconnectorState: 'Connected',
      childInfo: 12345,
      firmware: 'FM-123',
      id5: 'ID-12345',
      meterId: '123456',
      moduleId: '22222',
      parent: '77777',
      timeOfUseId: '5555',
      jobStatus: 'Running',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: true,
      ciiState: 'off',
      serialNumber: '39305917',
      instantValues: [
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        },
        {
          registerName: 'Relay 2 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        },
        {
          registerName: 'Relay 4 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 5 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 6 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b062'
        },
        {
          registerName: 'Relay 7 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b063'
        },
        {
          registerName: 'Relay 8 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b064'
        },
        {
          registerName: 'Relay 9 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b065'
        }
      ]
    },
    {
      deviceId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
      status: 'Active',
      name: 'Cubis PLC temp 423',
      readStatusTimeStamp: '2020-04-30T15:00:01',
      readStatusColor: 'green',
      vendor: 'Landis+Gy',
      tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8'],
      disconnectorState: 'ReadyForReConnection',
      childInfo: 12345,
      firmware: 'FM-223',
      id5: 'ID-12345',
      meterId: '1234456',
      moduleId: '22252',
      parent: '774777',
      timeOfUseId: '55455',
      jobStatus: 'Running',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: true,
      ciiState: 'on',
      serialNumber: '39305918',
      instantValues: [
        {
          registerName: 'Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        },
        {
          registerName: 'Relay 2 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        },
        {
          registerName: 'Relay 4 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 5 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 6 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        }
      ]
    },
    {
      deviceId: '22cfeaae-463a-4055-8632-a6818ba77d81',
      status: 'Mouted',
      name: 'Cubis PLC temp 753',
      readStatusTimeStamp: '2020-05-10T01:04:01',
      readStatusColor: 'green',
      vendor: 'Landis+Gy',
      tags: ['tag 8', 'tag 05', 'tag 572'],
      disconnectorState: 'Connected',
      childInfo: 12345,
      firmware: 'FM-223',
      id5: 'ID-12345',
      meterId: '1233456',
      moduleId: '222522',
      parent: '774777',
      timeOfUseId: '53555',
      jobStatus: 'Running',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: true,
      ciiState: 'on',
      serialNumber: '39305919',
      instantValues: [
        {
          registerName: 'Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 8 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b062'
        },
        {
          registerName: 'Relay 7 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b063'
        },
        {
          registerName: 'Relay 2 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b064'
        },
        {
          registerName: 'Relay 4 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b065'
        },
        {
          registerName: 'Relay 5 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b066'
        },
        {
          registerName: 'Relay 6 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b067'
        }
      ]
    },
    {
      deviceId: '141c94ca-1838-42b5-8c8a-96c5e07cc155',
      status: 'Active',
      name: 'Cubis PLC temp 844',
      readStatusTimeStamp: '2020-05-10T09:34:32',
      readStatusColor: 'Yellow',
      vendor: 'Landis+Gy',
      tags: ['tag 31', 'tag 572'],
      disconnectorState: 'connected',
      childInfo: 12345,
      firmware: 'FM-324',
      id5: 'ID-12345',
      meterId: '1234456',
      moduleId: '225222',
      parent: '777677',
      timeOfUseId: '55455',
      jobStatus: 'Success',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: true,
      ciiState: 'off',
      serialNumber: '39305920',
      instantValues: [
        {
          registerName: 'Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b061'
        },
        {
          registerName: 'Relay 8 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b062'
        },
        {
          registerName: 'Relay 7 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b063'
        },
        {
          registerName: 'Relay 2 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b064'
        },
        {
          registerName: 'Relay 4 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b065'
        },
        {
          registerName: 'Relay 5 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b066'
        },
        {
          registerName: 'Relay 6 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForReconnection',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b067'
        }
      ]
    },
    {
      deviceId: 'a8c35256-7960-4d0d-b4af-fdb2045378eb',
      status: 'Active',
      name: 'Cubis PLC temp 344',
      readStatusTimeStamp: '2020-05-05T11:04:03',
      readStatusColor: 'yellow',
      vendor: 'Landis+Gy',
      tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
      disconnectorState: 'disconnected',
      childInfo: 12345,
      firmware: 'FM-123',
      id5: 'ID-12345',
      meterId: '1232456',
      moduleId: '222522',
      parent: '776777',
      timeOfUseId: '5575',
      jobStatus: 'Success',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305921'
    },
    {
      deviceId: 'de32daef-4766-4afc-aa5f-bba5822bf9b0',
      status: 'Active',
      name: 'PLC dat 221',
      readStatusTimeStamp: '2020-02-17T04:26:37',
      readStatusColor: 'red',
      vendor: 'Iskra',
      disconnectorState: 'Disconnected',
      childInfo: 5,
      firmware: 'Firm Ware - 5',
      id5: '626516631021',
      meterId: 'M-Id694888174124',
      moduleId: 'Module-Id752225899452',
      parent: 'Parent - 2',
      timeOfUseId: 'TimeOfUse - 17',
      tags: null,
      jobStatus: 'Success',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: false,
      ciiState: 'on',
      serialNumber: '39305922',
      instantValues: [
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 1,
          interpretedValue: 'Connected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        }
      ]
    },
    {
      deviceId: 'e4694732-a282-477c-9c47-79ca08f64911',
      status: 'Mouted',
      name: 'PLC dat 915',
      readStatusTimeStamp: '2020-02-17T05:26:37',
      readStatusColor: 'red',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 3,
      firmware: 'Firm Ware - 1',
      id5: '977862534617',
      meterId: 'M-Id619256975638',
      moduleId: 'Module-Id932597197700',
      parent: 'Parent - 31',
      timeOfUseId: 'TimeOfUse - 21',
      tags: null,
      jobStatus: 'Failed',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: true,
      ciiState: 'off',
      serialNumber: '39305923',
      instantValues: [
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        }
      ]
    },
    {
      deviceId: '4db50891-45dc-4910-bc8e-1d1c15862a68',
      status: 'Active',
      name: 'PLC dat 387',
      readStatusTimeStamp: '2020-03-31T17:08:00',
      readStatusColor: 'red',
      vendor: 'Landis+Gy',
      disconnectorState: 'connected',
      childInfo: 1,
      firmware: 'Firm Ware - 3',
      id5: '991196390689',
      meterId: 'M-Id282050186794',
      moduleId: 'Module-Id877053746619',
      parent: 'Parent - 36',
      timeOfUseId: 'TimeOfUse - 4',
      tags: ['tag1', 'tag3', 'tag5'],
      jobStatus: 'Pending',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305924',
      instantValues: [
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadForActivation',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        }
      ]
    },
    {
      deviceId: '7f7e9055-ad99-479f-956f-903022e1cccd',
      status: 'Warehouse',
      name: 'PLC dat 626',
      readStatusTimeStamp: '2020-05-09T12:02:33',
      readStatusColor: 'green',
      vendor: 'Landis+Gy',
      disconnectorState: 'disconnected',
      childInfo: 4,
      firmware: 'Firm Ware - 1',
      id5: '645461952652',
      meterId: 'M-Id975014015573',
      moduleId: 'Module-Id772155035260',
      parent: 'Parent - 33',
      timeOfUseId: 'TimeOfUse - 15',
      tags: ['tag31', 'tag32'],
      jobStatus: 'Failed',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305925',
      instantValues: [
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 0,
          interpretedValue: 'Disconnected',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        },
        {
          registerName: 'Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state Relay 1 state',
          registerType: 52,
          timestamp: '2021-02-24T08:46:19.7957895+01:00',
          value: 2,
          interpretedValue: 'ReadyForActivation',
          registerId: '435e0506-fb98-4fa6-a140-3f83c212b060'
        }
      ]
    },
    {
      deviceId: 'f8eb8b9f-bd39-406c-8ebc-c2659ab48246',
      status: 'Warehouse',
      name: 'PLC dat 623',
      readStatusTimeStamp: '2020-05-11T12:14:00',
      readStatusColor: 'green',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 5,
      firmware: 'Firm Ware - 1',
      id5: '372969078122',
      meterId: 'M-Id874231899211',
      moduleId: 'Module-Id267729073259',
      parent: 'Parent - 13',
      timeOfUseId: 'TimeOfUse - 10',
      tags: ['tag1', 'tag3', 'tag5'],
      jobStatus: 'Pending',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305926'
    },
    {
      deviceId: '74cc061f-69f4-48e3-8fb6-1a1e88cdd3d3',
      status: 'Warehouse',
      name: 'PLC dat 345',
      readStatusTimeStamp: '2020-05-03T00:00:00',
      readStatusColor: 'green',
      vendor: 'Iskra',
      disconnectorState: 'connected',
      childInfo: 4,
      firmware: 'Firm Ware - 3',
      id5: '878565520965',
      meterId: 'M-Id141708173203',
      moduleId: 'Module-Id407426421248',
      parent: 'Parent - 30',
      timeOfUseId: 'TimeOfUse - 17',
      tags: null,
      jobStatus: 'Failed',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: false,
      ciiState: '',
      serialNumber: '39305927'
    },
    {
      deviceId: 'bd50a59a-e791-470b-b328-7e3dc9b0a5df',
      status: 'Warehouse',
      name: 'PLC dat 954',
      readStatusTimeStamp: '2019-12-14T03:12:11',
      readStatusColor: 'red',
      vendor: 'Iskra',
      disconnectorState: 'connected',
      childInfo: 1,
      firmware: 'Firm Ware - 0',
      id5: '297789917782',
      meterId: 'M-Id464071230967',
      moduleId: 'Module-Id661863757617',
      parent: 'Parent - 29',
      timeOfUseId: 'TimeOfUse - 12',
      tags: ['tag1', 'tag3', 'tag5'],
      jobStatus: 'Failed',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305928'
    },
    {
      deviceId: '18d2fcdc-0809-4fb3-8b68-bbe35262b344',
      status: 'Active',
      name: 'PLC dat 233',
      readStatusTimeStamp: '2019-12-20T20:20:20',
      readStatusColor: 'red',
      vendor: 'Landis+Gy',
      disconnectorState: 'disconnected',
      childInfo: 1,
      firmware: 'Firm Ware - 5',
      id5: '833452712479',
      meterId: 'M-Id995410774000',
      moduleId: 'Module-Id432607105778',
      parent: 'Parent - 12',
      timeOfUseId: 'TimeOfUse - 33',
      tags: null,
      jobStatus: null,
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305929'
    },
    {
      deviceId: 'f790398c-5dc3-4511-ba8b-4b281b78fc49',
      status: 'Warehouse',
      name: 'PLC dat 659',
      readStatusTimeStamp: '2019-10-02T05:09:23',
      readStatusColor: 'red',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 0,
      firmware: 'Firm Ware - 5',
      id5: '770053695430',
      meterId: 'M-Id578229577695',
      moduleId: 'Module-Id127686024141',
      parent: 'Parent - 44',
      timeOfUseId: 'TimeOfUse - 13',
      tags: ['tag31', 'tag32'],
      jobStatus: null,
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: false,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305930'
    },
    {
      deviceId: '26dd5e0a-4342-496a-93c7-a0ee8ac94a33',
      status: 'Mouted',
      name: 'PLC dat 519',
      readStatusTimeStamp: '2019-09-18T19:18:59',
      readStatusColor: 'red',
      vendor: 'Landis+Gy',
      disconnectorState: 'connected',
      childInfo: 0,
      firmware: 'Firm Ware - 1',
      id5: '591174417896',
      meterId: 'M-Id616485091080',
      moduleId: 'Module-Id469940096397',
      parent: 'Parent - 24',
      timeOfUseId: 'TimeOfUse - 26',
      tags: null,
      jobStatus: null,
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305931'
    },
    {
      deviceId: 'bc8b49f4-f3b3-4975-8a6e-05134d1cd350',
      status: 'Mouted',
      name: 'PLC dat 656',
      readStatusTimeStamp: '2020-01-18T19:18:59',
      readStatusColor: 'red',
      vendor: 'Landis+Gy',
      disconnectorState: 'connected',
      childInfo: 4,
      firmware: 'Firm Ware - 3',
      id5: '335885084936',
      meterId: 'M-Id591841760319',
      moduleId: 'Module-Id693512246543',
      parent: 'Parent - 48',
      timeOfUseId: 'TimeOfUse - 27',
      tags: ['tag1', 'tag3', 'tag5'],
      jobStatus: 'Running',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305932'
    },
    {
      deviceId: '9b56c3b3-0ba2-4103-ac77-c8732ffb3472',
      status: 'Warehouse',
      name: 'PLC dat 773',
      readStatusTimeStamp: '2020-05-05T03:29:19',
      readStatusColor: 'green',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 2,
      firmware: 'Firm Ware - 4',
      id5: '755019885413',
      meterId: 'M-Id704325148357',
      moduleId: 'Module-Id843682967652',
      parent: 'Parent - 30',
      timeOfUseId: 'TimeOfUse - 3',
      tags: null,
      jobStatus: 'Failed',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305933'
    },
    {
      deviceId: '5e8639d1-9c3d-46ea-bbdd-4770baefafbf',
      status: 'Active',
      name: 'PLC dat 284',
      readStatusTimeStamp: '2020-05-05T03:21:19',
      readStatusColor: 'yellow',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 4,
      firmware: 'Firm Ware - 3',
      id5: '778012660138',
      meterId: 'M-Id420898080004',
      moduleId: 'Module-Id982525535419',
      parent: 'Parent - 34',
      timeOfUseId: 'TimeOfUse - 32',
      tags: null,
      jobStatus: 'Success',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305934'
    },
    {
      deviceId: 'r42234-9c3d-46ea-bbdd-4770baefafbf',
      status: 'Mouted',
      name: 'PLC dat 2824',
      readStatusTimeStamp: '2020-04-02T12:33:12',
      readStatusColor: 'yellow',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 14,
      firmware: 'Firm Ware - 3',
      id5: '778012660138',
      meterId: 'M-Id420898080004',
      moduleId: 'Module-Id98332525535419',
      parent: 'Parent - 134',
      timeOfUseId: 'TimeOfUse - 322',
      tags: null,
      jobStatus: 'Pending',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305935'
    },
    {
      deviceId: '90976-9c3d-46ea-bbdd-4770baefafbf',
      status: 'Active',
      name: 'PLC dat 22384',
      readStatusTimeStamp: '2020-01-24T04:31:00',
      readStatusColor: 'red',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 3,
      firmware: 'Firm Ware - 312',
      id5: '3q233112',
      meterId: 'M-Id420898080004',
      moduleId: 'Module-Id98332525535419',
      parent: 'Parent - 331',
      timeOfUseId: 'TimeOfUse - 2123',
      tags: null,
      jobStatus: 'Pending',
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305936'
    },
    {
      deviceId: '90976-9c3d-46ea-642234-4770baefafbf',
      status: 'Active',
      name: 'PLC dat 543',
      readStatusTimeStamp: '2020-05-10T10:00:03',
      readStatusColor: 'green',
      vendor: 'Iskra',
      disconnectorState: 'disconnected',
      childInfo: 3,
      firmware: 'Firm Ware - 312',
      id5: '3q233112',
      meterId: 'M-Id420898080004',
      moduleId: 'Module-Id98332525535419',
      parent: 'Parent - 12',
      timeOfUseId: 'TimeOfUse - 22',
      tags: null,
      jobStatus: null,
      configurationId: 'conf1',
      id1: 'id1',
      id2: 'id2',
      id3: 'id3',
      id4: 'id4',
      id6: 'id6',
      logicalDeviceName: 'device name 1',
      parametrisationId: 'param 1',
      readyForActivation: true,
      hasActiveJobs: false,
      ciiState: 'off',
      serialNumber: '39305937'
    }
  ];
}

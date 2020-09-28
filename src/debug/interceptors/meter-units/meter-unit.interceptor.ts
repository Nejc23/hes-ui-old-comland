import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnit } from 'src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { device } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitInterceptor {
  constructor(private router: ActivatedRoute) {}

  static interceptGetMeterUnit(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnit[] = setData();

    let deviceId = request.url.split('/').pop();

    if (!deviceId || deviceId.length === 0) {
      return of(
        new HttpResponse({
          status: 204
        })
      );
    }

    deviceId = deviceId.toLowerCase();
    const body = data.find(d => d.deviceId.toLowerCase() === deviceId);

    return of(
      new HttpResponse({
        status: body ? 200 : 204,
        body
      })
    );
  }

  static canInterceptGetMeterUnit(request: HttpRequest<any>): boolean {
    return new RegExp(device + `/`).test(request.url) && request.method.endsWith('GET');
  }
}

function setData(): MeterUnit[] {
  return [
    {
      deviceId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      statusValue: 'Active',
      statusId: 1,
      name: 'Cubis PLC temp 520',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: 'ID-12345',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
      statusValue: 'Active',
      statusId: 1,
      name: 'Cubis PLC temp 423',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: 'ID-12345',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '22cfeaae-463a-4055-8632-a6818ba77d81',
      statusValue: 'Mounted',
      statusId: 3,
      name: 'Cubis PLC temp 753',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: 'ID-12345',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '141c94ca-1838-42b5-8c8a-96c5e07cc155',
      statusValue: 'Active',
      statusId: 1,
      name: 'Cubis PLC temp 844',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: 'ID-12345',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'a8c35256-7960-4d0d-b4af-fdb2045378eb',
      statusValue: 'Active',
      statusId: 1,
      name: 'Cubis PLC temp 344',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: 'ID-12345',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'de32daef-4766-4afc-aa5f-bba5822bf9b0',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 221',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '626516631021',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'e4694732-a282-477c-9c47-79ca08f64911',
      statusValue: 'Mouted',
      statusId: 3,
      name: 'PLC dat 915',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '977862534617',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '4db50891-45dc-4910-bc8e-1d1c15862a68',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 387',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: '991196390689',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '7f7e9055-ad99-479f-956f-903022e1cccd',
      statusValue: 'Deleted',
      statusId: 4,
      name: 'PLC dat 626',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: '645461952652',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'f8eb8b9f-bd39-406c-8ebc-c2659ab48246',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 623',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '372969078122',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC',
      templateId: '06130d62-f67c-41a2-98f7-ef521db2cee6'
    },
    {
      deviceId: '74cc061f-69f4-48e3-8fb6-1a1e88cdd3d3',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 345',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '878565520965',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'Discovery'
    },
    {
      deviceId: 'bd50a59a-e791-470b-b328-7e3dc9b0a5df',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 954',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '297789917782',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '18d2fcdc-0809-4fb3-8b68-bbe35262b344',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 233',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: '833452712479',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'f790398c-5dc3-4511-ba8b-4b281b78fc49',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 659',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '770053695430',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '26dd5e0a-4342-496a-93c7-a0ee8ac94a33',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 519',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: '591174417896',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'bc8b49f4-f3b3-4975-8a6e-05134d1cd350',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 656',
      vendorValue: 'Landis+Gy',
      vendorId: 1,
      id5: '335885084936',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '9b56c3b3-0ba2-4103-ac77-c8732ffb3472',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 773',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '755019885413',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '5e8639d1-9c3d-46ea-bbdd-4770baefafbf',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 284',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '778012660138',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: 'r42234-9c3d-46ea-bbdd-4770baefafbf',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 2824',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '778012660138',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '90976-9c3d-46ea-bbdd-4770baefafbf',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 22384',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '3q233112',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    },
    {
      deviceId: '90976-9c3d-46ea-642234-4770baefafbf',
      statusValue: 'Active',
      statusId: 1,
      name: 'PLC dat 543',
      vendorValue: 'Iskra',
      vendorId: 2,
      id5: '3q233112',
      logicalDeviceName: 'device name 1',
      typeId: 1,
      typeValue: 'G3-PLC'
    }
  ];
}

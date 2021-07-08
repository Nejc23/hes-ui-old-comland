import { TestBed } from '@angular/core/testing';
import { RegisterValue } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';

import { RegisterStatisticsService } from './register-statistics.service';

describe('RegisterStatisticsService', () => {
  let service: RegisterStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null', () => {
    const registerStatistics = service.getRegisterStatistics([]);
    expect(registerStatistics).toBeNull();
  });

  it('should create and compute RegisterStatistics', () => {
    const registerStatistics = service.getRegisterStatistics(registerData);
    expect(registerStatistics).toBeTruthy();
    expect(registerStatistics.averageValue).toBe(104.94725);
    expect(registerStatistics.maxValue).toBeTruthy();
    expect(registerStatistics.maxValue.valueWithUnit.value).toBe('249.78');
    expect(registerStatistics.minValue).toBeTruthy();
    expect(registerStatistics.minValue.valueWithUnit.value).toBe('2.178');
  });

  const registerData: RegisterValue[] = [
    {
      requestId: null,
      valueWithUnit: {
        unit: '',
        value: '83.001'
      },
      timestamp: '2020-10-29T08:46:17+01:00'
    },
    {
      requestId: null,
      valueWithUnit: {
        unit: '',
        value: '84.83'
      },
      timestamp: '2020-10-29T08:46:17+01:00'
    },
    {
      requestId: null,
      valueWithUnit: {
        unit: '',
        value: '249.78'
      },
      timestamp: '2020-10-29T09:36:17+01:00',
      description: 'test description 1'
    },
    {
      requestId: null,
      valueWithUnit: {
        unit: '',
        value: '2.178'
      },
      timestamp: '2020-10-29T09:36:17+01:00'
    }
  ];
});

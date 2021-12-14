import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import {
  ConfigurationBasicDto,
  ConfigurationCreateDto,
  ConfigurationDetailDto,
  DayActionConfigCreateDto,
  DayConfigCreateDto,
  DayDetailDto,
  SeasonConfigCreateDto,
  SpecialDayConfigCreateDto,
  WeekConfigCreateDto
} from 'src/app/api/time-of-use/models';
import { ConfigurationService } from 'src/app/api/time-of-use/services';
import { RepositoryService } from '../../../../core/repository/services/repository.service';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { dateServerFormat } from '../../../../shared/forms/consts/date-format';
import { Codelist } from '../../../../shared/repository/interfaces/codelists/codelist.interface';
import { TimeUnitClient, TimeUnitTypeClient, UnitClient } from '../components/plc-meter-tou-config/add-time-unit/add-time-unit.component';
import { TouWizardService } from './wizard.service';

export interface TimeUnitsClient {
  type: TimeUnitTypeClient;
  units: UnitClient[];
}

export interface TouConfigurationClient {
  valid?: boolean;
  basic: TouBasicConfigurationClient;
  days?: TimeUnitsClient;
  weeks?: TimeUnitsClient;
  seasons?: TimeUnitsClient;
  specialDays?: any[];
}

export interface TouBasicConfigurationClient {
  id: string;
  description: string;
  activationEnabled?: boolean;
  startDate?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TouConfigService {
  timeUnits: Array<TimeUnitsClient> = [];
  touConfigurationClient: TouConfigurationClient;

  constructor(
    private repository: RepositoryService,
    private router: Router,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private touWizard: TouWizardService,
    private touConfigurationService: ConfigurationService
  ) {
    this.initTimeUnits();
  }

  // client data
  getTimeUnits(type: TimeUnitTypeClient): TimeUnitsClient {
    return this.timeUnits.find((unit) => unit.type === type);
  }

  createNewTouConfigurationClient() {
    const tou = (this.touConfigurationClient = JSON.parse(sessionStorage.getItem('touConfig')));
    if (!tou) {
      this.touConfigurationClient = {
        basic: {
          description: '',
          id: null
        },
        specialDays: []
      };
      this.initTimeUnits();
      this.touWizard.setMenuItemsInitValues();
    }
  }

  saveBasicStep(data: TouBasicConfigurationClient) {
    this.touConfigurationClient.basic = data;
    sessionStorage.setItem('touConfig', JSON.stringify(this.touConfigurationClient));
  }

  getTouConfig() {
    return this.touConfigurationClient;
  }

  saveUnit(data: TimeUnitsClient, type: TimeUnitTypeClient) {
    switch (type) {
      case TimeUnitTypeClient.DAY:
        this.touConfigurationClient.days = data;
        break;
      case TimeUnitTypeClient.WEEK:
        this.touConfigurationClient.weeks = data;
        break;
      case TimeUnitTypeClient.SEASON:
        this.touConfigurationClient.seasons = data;
        break;
    }
    sessionStorage.setItem('touConfig', JSON.stringify(this.touConfigurationClient));
  }

  addSpecialDays(days: any[]) {
    this.touConfigurationClient.specialDays = days;
    sessionStorage.setItem('touConfig', JSON.stringify(this.touConfigurationClient));
  }

  saveTouConfiguration() {
    const configCreateDto: ConfigurationCreateDto = this.castTouConfigurationClientToConfigurationCreateDto();

    this.addTouConfiguration(configCreateDto).subscribe(
      (res) => {
        sessionStorage.removeItem('touConfig');
        this.createNewTouConfigurationClient();
        this.toast.successToast(this.translate.instant('TOU-CONFIG.SAVE-TOU-SUCCESSFUL'));
        this.router.navigate(['/configuration/importTouConfiguration/list']);
      },
      (err: HttpErrorResponse) => {
        this.toast.errorToast(this.translate.instant('TOU-CONFIG.SAVE-ERROR'));
        const errors = err.error as Array<string>;
        errors.forEach((errMsg) => {
          this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${errMsg}`));
        });
      }
    );
  }

  // backend calls
  getAllConfigurations(): Observable<Array<ConfigurationBasicDto>> {
    return this.touConfigurationService.configurationsGet$Json();
  }

  addTouConfiguration(body: ConfigurationCreateDto): Observable<string> {
    return this.touConfigurationService.configurationsPost$Json({ body: body });
  }

  deleteConfiguration(id: string): Observable<void> {
    return this.touConfigurationService.configurationsConfigurationIdDelete({ configurationId: id });
  }

  getConfiguration(id: string): Observable<ConfigurationDetailDto> {
    return this.touConfigurationService.configurationsConfigurationIdGet$Json({ configurationId: id });
  }

  initTimeUnits() {
    this.timeUnits = [];
    this.timeUnits.push(
      {
        type: TimeUnitTypeClient.DAY,
        units: []
      },
      {
        type: TimeUnitTypeClient.WEEK,
        units: []
      },
      {
        type: TimeUnitTypeClient.SEASON,
        units: []
      }
    );
  }

  isConfigurationValid() {
    if (this.touConfigurationClient.days.units.find((item) => item.unit.length === 0)) {
      return false;
    } else {
      return (
        this.touConfigurationClient.days.units.length > 0 &&
        this.touConfigurationClient.weeks.units.length > 0 &&
        this.touConfigurationClient.seasons.units.length > 0 &&
        this.touConfigurationClient.specialDays.length > 0
      );
    }
  }

  /**
   * Cast property touConfigurationClient type of TouConfigurationClient to ToConfigurationCreateDto type.
   * @returns ConfigurationCreateDto object.
   */
  castTouConfigurationClientToConfigurationCreateDto(): ConfigurationCreateDto {
    const configCreateDto: ConfigurationCreateDto = {
      externalId: this.touConfigurationClient.basic.id,
      description: this.touConfigurationClient.basic.description,
      activation: this.touConfigurationClient.basic.startDate
        ? moment(this.touConfigurationClient.basic.startDate).format(dateServerFormat)
        : null,
      days: [] as Array<DayConfigCreateDto>,
      weeks: [] as Array<WeekConfigCreateDto>,
      seasons: [] as Array<SeasonConfigCreateDto>,
      specialDays: [] as Array<SpecialDayConfigCreateDto>
    };

    this.touConfigurationClient.days.units.forEach((day) => {
      const dayCreateDto = {
        externalId: day.id,
        description: day.description,
        dayActions: [] as Array<DayActionConfigCreateDto>
      };
      day.unit.forEach((unit) => {
        const dayActionCreateDto: DayActionConfigCreateDto = {
          hour: unit.startTime.split(':')[0],
          minute: unit.startTime.split(':')[1],
          scriptActionId: unit.scriptId
        };
        dayCreateDto.dayActions.push(dayActionCreateDto);
      });
      configCreateDto.days.push(dayCreateDto);
    });

    this.touConfigurationClient.weeks.units.forEach((week) => {
      const weekCreateDto: WeekConfigCreateDto = {
        externalId: week.id,
        description: week.description,
        mondayExternalId: week.unit[0].dayId.id,
        tuesdayExternalId: week.unit[1].dayId.id,
        wednesdayExternalId: week.unit[2].dayId.id,
        thursdayExternalId: week.unit[3].dayId.id,
        fridayExternalId: week.unit[4].dayId.id,
        saturdayExternalId: week.unit[5].dayId.id,
        sundayExternalId: week.unit[6].dayId.id
      };
      configCreateDto.weeks.push(weekCreateDto);
    });

    this.touConfigurationClient.seasons.units.forEach((season) => {
      const seasonCreateDto: SeasonConfigCreateDto = {
        externalId: season.id,
        description: season.description,
        day: moment(season.unit[0].date).toDate().getDate(),
        month: moment(season.unit[0].date).toDate().getMonth() + 1,
        weekExternalId: season.unit[0].weekId.id
      };
      configCreateDto.seasons.push(seasonCreateDto);
    });

    this.touConfigurationClient.specialDays.forEach((specialDay) => {
      const specialDayCreateDto: SpecialDayConfigCreateDto = {
        day: moment(specialDay.startDate).toDate().getDate(),
        month: moment(specialDay.startDate).toDate().getMonth() + 1,
        year: specialDay.annually ? '' : specialDay.year,
        dayExternalId: specialDay.dayId.id
      };
      configCreateDto.specialDays.push(specialDayCreateDto);
    });

    console.log(JSON.stringify(configCreateDto));

    return configCreateDto;
  }

  /**
   * Cast ConfigurationDetailDto object to TouConfigurationClient type.
   * @param configurationDetailDto ConfigurationDetailDto object.
   * @returns TouConfigurationClient object.
   */
  castConfigurationDetailDtoToTouConfigurationClient(configurationDetailDto: ConfigurationDetailDto): TouConfigurationClient {
    // TODO: check date!?
    const activation = configurationDetailDto.activation ? new Date(configurationDetailDto.activation) : null;
    const touConfigurationClient: TouConfigurationClient = {
      basic: {
        // TODO: missing id/externalId.
        id: configurationDetailDto.externalId,
        description: configurationDetailDto.description,
        activationEnabled: activation != null,
        startDate: activation ?? '' // TODO: check this
      } as TouBasicConfigurationClient,
      days: null as TimeUnitsClient,
      weeks: null as TimeUnitsClient,
      seasons: null as TimeUnitsClient,
      specialDays: [] as any[]
    };

    // Days.
    const daysTimeUnits = {
      type: TimeUnitTypeClient.DAY,
      units: [] as Array<UnitClient>
    } as TimeUnitsClient;
    if (configurationDetailDto.days != undefined) {
      configurationDetailDto.days?.forEach((dayDto) => {
        const dayUnit = {
          // TODO: missing id/externalId.
          id: dayDto.externalId,
          description: dayDto.description,
          unit: [] as Array<any> // Day actions.
        } as UnitClient;
        // Day actions.
        const dayActionUnits = [] as Array<any>;
        dayDto.dayActions.forEach((dayActionDto) => {
          const dayActionUnit = {
            // TODO: missing id
            // id: dayActionDto.id,
            startTime: `${('0' + dayActionDto.hour).slice(-2)}:${('0' + dayActionDto.minute).slice(-2)}`,
            scriptId: dayActionDto.scriptActionId
          } as TimeUnitClient;
          dayActionUnits.push(dayActionUnit);
        });
        dayUnit.unit = dayActionUnits;
        daysTimeUnits.units.push(dayUnit);
      });
    }
    touConfigurationClient.days = daysTimeUnits;

    // Weeks.
    const weeksTimeUnits = {
      type: TimeUnitTypeClient.WEEK,
      units: [] as Array<UnitClient>
    } as TimeUnitsClient;
    if (configurationDetailDto.weeks != undefined) {
      configurationDetailDto.weeks?.forEach((weekDto) => {
        const weekUnit = {
          // TODO: missing id/externalId.
          id: weekDto.externalId,
          description: weekDto.description,
          unit: [] as Array<any> // Days in week.
        } as UnitClient;

        // Days of week.
        const dayMo = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.mondayId);
        weekUnit.unit.push({ day: 'mo', dayId: dayMo });
        const dayTu = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.tuesdayId);
        weekUnit.unit.push({ day: 'tu', dayId: dayTu });
        const dayWe = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.wednesdayId);
        weekUnit.unit.push({ day: 'we', dayId: dayWe });
        const dayTh = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.thursdayId);
        weekUnit.unit.push({ day: 'th', dayId: dayTh });
        const dayFr = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.fridayId);
        weekUnit.unit.push({ day: 'fr', dayId: dayFr });
        const daySa = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.saturdayId);
        weekUnit.unit.push({ day: 'sa', dayId: daySa });
        const daySu = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.sundayId);
        weekUnit.unit.push({ day: 'su', dayId: daySu });

        weeksTimeUnits.units.push(weekUnit);
      });
    }
    touConfigurationClient.weeks = weeksTimeUnits;

    // Seasons.
    const seasonsTimeUnits = {
      type: TimeUnitTypeClient.SEASON,
      units: [] as Array<UnitClient>
    } as TimeUnitsClient;
    if (configurationDetailDto.seasons != undefined) {
      configurationDetailDto.seasons?.forEach((seasonDto) => {
        const seasonUnit = {
          // TODO: missing id/externalId.
          id: seasonDto.externalId,
          description: seasonDto.description,
          unit: [] as Array<any> // Week.
        } as UnitClient;

        const week = configurationDetailDto.weeks?.find((w) => w.id == seasonDto.weekId);
        const seasonWeek = {
          date: new Date(2021, seasonDto.month - 1, seasonDto.day),
          weekId: {
            id: week.externalId,
            value: week.description
          } as Codelist<number>
        };
        seasonUnit.unit.push(seasonWeek);
        seasonsTimeUnits.units.push(seasonUnit);
      });
    }
    touConfigurationClient.seasons = seasonsTimeUnits;

    // Special days.
    const specialDays = [];
    if (configurationDetailDto.specialDays != undefined) {
      configurationDetailDto.specialDays?.forEach((specialDay) => {
        const specialDayDay = configurationDetailDto.days.find((d) => d.id == specialDay.dayId);
        const specialDayClient = {
          startDate: new Date(specialDay.year ?? 2021, specialDay.month, specialDay.day),
          dayId: {
            id: specialDayDay.externalId,
            value: specialDayDay.description
          } as Codelist<number>,
          annually: specialDay.year == null
        };
        specialDays.push(specialDayClient);
      });
    }
    touConfigurationClient.specialDays = specialDays;

    console.log(JSON.stringify(touConfigurationClient));

    return touConfigurationClient;
  }

  /**
   * Find day id (CodeList) for week by dayId.
   * @param days List of days.
   * @param dayId Day id.
   * @returns Day as code list.
   */
  getDayIdForWeekUnit(days: Array<DayDetailDto>, dayId: string): Codelist<number> {
    const dayDto = days.find((d) => d.id == dayId);
    const weekDayId = {
      id: dayDto.externalId,
      value: dayDto.description
    } as Codelist<number>;

    return weekDayId;
  }
}

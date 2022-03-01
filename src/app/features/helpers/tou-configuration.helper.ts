import { Injectable } from '@angular/core';
import { parseNumber } from '@progress/kendo-angular-intl';
import * as moment from 'moment';
import {
  ConfigurationCreateDto,
  ConfigurationDetailDto,
  ConfigurationState,
  ConfigurationUpdateDto,
  DayActionConfigCreateDto,
  DayConfigCreateDto,
  DayDetailDto,
  SeasonConfigCreateDto,
  SpecialDayConfigCreateDto,
  WeekConfigCreateDto,
  WeekCreateDto,
  WeekUpdateDto
} from 'src/app/api/time-of-use/models';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { SeasonUnitClient } from 'src/app/models/tou-configuration/SeasonUnitClient';
import { SpecialDayUnitClient } from 'src/app/models/tou-configuration/SpecialDayUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { TouBasicConfigurationClient } from 'src/app/models/tou-configuration/TouBasicConfigurationClient';
import { TouConfigurationClient } from 'src/app/models/tou-configuration/TouConfigurationClient';
import { UnitClient } from 'src/app/models/tou-configuration/UnitClient';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { WeekUnitClient } from 'src/app/models/tou-configuration/WeekUnitClient';
import { dateServerFormat } from 'src/app/shared/forms/consts/date-format';

@Injectable({
  providedIn: 'root'
})
export class TouConfigurationHelper {
  constructor() {}

  /**
   * Cast property touConfigurationClient type of TouConfigurationClient to ToConfigurationCreateDto type.
   * @returns ConfigurationCreateDto object.
   */
  castTouConfigurationClientToConfigurationCreateDto(touConfigClient: TouConfigurationClient): ConfigurationCreateDto {
    const configCreateDto: ConfigurationCreateDto = {
      externalId: touConfigClient.basic.externalId,
      description: touConfigClient.basic.description,
      activation: touConfigClient.basic.startDate ? moment(touConfigClient.basic.startDate).format(dateServerFormat) : null,
      days: [] as Array<DayConfigCreateDto>,
      weeks: [] as Array<WeekConfigCreateDto>,
      seasons: [] as Array<SeasonConfigCreateDto>,
      specialDays: [] as Array<SpecialDayConfigCreateDto>
    };

    touConfigClient.days.units.forEach((day) => {
      const dayCreateDto = {
        externalId: day.externalId,
        description: day.description,
        dayActions: [] as Array<DayActionConfigCreateDto>
      };
      day.units.forEach((unit) => {
        const dayActionCreateDto: DayActionConfigCreateDto = {
          hour: parseNumber(unit.startTime.split(':')[0]),
          minute: parseNumber(unit.startTime.split(':')[1]),
          scriptActionId: unit.scriptId
        };
        dayCreateDto.dayActions.push(dayActionCreateDto);
      });
      configCreateDto.days.push(dayCreateDto);
    });

    touConfigClient.weeks.units.forEach((week) => {
      const weekCreateDto: WeekConfigCreateDto = {
        externalId: week.externalId,
        description: week.description,
        mondayExternalId: week.units[0].day.externalId,
        tuesdayExternalId: week.units[1].day.externalId,
        wednesdayExternalId: week.units[2].day.externalId,
        thursdayExternalId: week.units[3].day.externalId,
        fridayExternalId: week.units[4].day.externalId,
        saturdayExternalId: week.units[5].day.externalId,
        sundayExternalId: week.units[6].day.externalId
      };
      configCreateDto.weeks.push(weekCreateDto);
    });

    touConfigClient.seasons.units.forEach((season) => {
      const seasonCreateDto: SeasonConfigCreateDto = {
        externalId: season.externalId,
        description: season.description,
        day: moment(season.units[0].date).toDate().getDate(),
        month: moment(season.units[0].date).toDate().getMonth() + 1,
        weekExternalId: season.units[0].week.externalId
      };
      configCreateDto.seasons.push(seasonCreateDto);
    });

    touConfigClient.specialDays.forEach((specialDay) => {
      const specialDayCreateDto: SpecialDayConfigCreateDto = {
        day: moment(specialDay.startDate).toDate().getDate(),
        month: moment(specialDay.startDate).toDate().getMonth() + 1,
        year: specialDay.annually ? null : specialDay.year,
        dayExternalId: specialDay.day.externalId
      };
      configCreateDto.specialDays.push(specialDayCreateDto);
    });

    return configCreateDto;
  }

  /**
   * Cast ConfigurationDetailDto object to TouConfigurationClient type.
   * @param configurationDetailDto ConfigurationDetailDto object.
   * @returns TouConfigurationClient object.
   */
  castConfigurationDetailDtoToTouConfigurationClient(configurationDetailDto: ConfigurationDetailDto): TouConfigurationClient {
    const activation = configurationDetailDto.activation ? new Date(configurationDetailDto.activation) : null;
    const touConfigurationClient: TouConfigurationClient = {
      basic: {
        id: configurationDetailDto.id,
        externalId: configurationDetailDto.externalId,
        description: configurationDetailDto.description,
        activationEnabled: activation != null,
        startDate: activation ?? ''
      } as TouBasicConfigurationClient,
      days: null as TimeUnitsClient<number, DayUnitClient>,
      weeks: null as TimeUnitsClient<number, WeekUnitClient>,
      seasons: null as TimeUnitsClient<number, SeasonUnitClient>,
      specialDays: [] as any[]
    };

    // Days.
    const daysTimeUnits = {
      type: TimeUnitClientType.DAY,
      units: [] as Array<UnitClient<number, DayUnitClient>>
    } as TimeUnitsClient<number, DayUnitClient>;
    if (configurationDetailDto.days != undefined) {
      configurationDetailDto.days?.forEach((dayDto) => {
        const dayUnit = {
          id: dayDto.id,
          externalId: dayDto.externalId,
          description: dayDto.description,
          units: [] as Array<DayUnitClient> // Day actions.
        } as UnitClient<number, DayUnitClient>;
        // Day actions.
        const dayActionUnits = [] as Array<DayUnitClient>;
        dayDto.dayActions.forEach((dayActionDto) => {
          const dayActionUnit = {
            id: dayActionDto.id,
            // externalId:dayActionDto.dayId
            startTime: `${('0' + dayActionDto.hour).slice(-2)}:${('0' + dayActionDto.minute).slice(-2)}`,
            scriptId: dayActionDto.scriptActionId
          } as DayUnitClient;
          dayActionUnits.push(dayActionUnit);
        });
        dayUnit.units = dayActionUnits;
        daysTimeUnits.units.push(dayUnit);
      });
    }
    touConfigurationClient.days = daysTimeUnits;

    // Weeks.
    const weeksTimeUnits = {
      type: TimeUnitClientType.WEEK,
      units: [] as Array<UnitClient<number, WeekUnitClient>>
    } as TimeUnitsClient<number, WeekUnitClient>;
    if (configurationDetailDto.weeks != undefined) {
      configurationDetailDto.weeks?.forEach((weekDto) => {
        const weekUnit = {
          id: weekDto.id,
          externalId: weekDto.externalId,
          description: weekDto.description,
          units: [] as WeekUnitClient[]
        } as UnitClient<number, WeekUnitClient>;

        // Days of week.
        const dayMo = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.mondayId);
        weekUnit.units.push({ dayCode: 'mo', day: dayMo } as WeekUnitClient);
        const dayTu = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.tuesdayId);
        weekUnit.units.push({ dayCode: 'tu', day: dayTu } as WeekUnitClient);
        const dayWe = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.wednesdayId);
        weekUnit.units.push({ dayCode: 'we', day: dayWe } as WeekUnitClient);
        const dayTh = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.thursdayId);
        weekUnit.units.push({ dayCode: 'th', day: dayTh } as WeekUnitClient);
        const dayFr = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.fridayId);
        weekUnit.units.push({ dayCode: 'fr', day: dayFr } as WeekUnitClient);
        const daySa = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.saturdayId);
        weekUnit.units.push({ dayCode: 'sa', day: daySa } as WeekUnitClient);
        const daySu = this.getDayIdForWeekUnit(configurationDetailDto.days, weekDto.sundayId);
        weekUnit.units.push({ dayCode: 'su', day: daySu } as WeekUnitClient);

        weeksTimeUnits.units.push(weekUnit);
      });
    }
    touConfigurationClient.weeks = weeksTimeUnits;

    // Seasons.
    const seasonsTimeUnits = {
      type: TimeUnitClientType.SEASON,
      units: [] as Array<UnitClient<number, SeasonUnitClient>>
    } as TimeUnitsClient<number, SeasonUnitClient>;
    if (configurationDetailDto.seasons != undefined) {
      configurationDetailDto.seasons?.forEach((seasonDto) => {
        const seasonUnit = {
          id: seasonDto.id,
          externalId: seasonDto.externalId,
          description: seasonDto.description,
          units: [] as SeasonUnitClient[] // Week of season.
        } as UnitClient<number, SeasonUnitClient>;

        const week = configurationDetailDto.weeks?.find((w) => w.id == seasonDto.weekId);
        const seasonWeek = {
          date: new Date(2021, seasonDto.month - 1, seasonDto.day),
          week: {
            id: week.id,
            externalId: week.externalId,
            value: week.description
          } as UnitCodeListItemClient<number>
        } as SeasonUnitClient;
        seasonUnit.units.push(seasonWeek);
        seasonsTimeUnits.units.push(seasonUnit);
      });
    }
    touConfigurationClient.seasons = seasonsTimeUnits;

    // Special days.
    const specialDays = [] as SpecialDayUnitClient[];
    if (configurationDetailDto.specialDays != undefined) {
      configurationDetailDto.specialDays?.forEach((specialDay) => {
        const specialDayDay = configurationDetailDto.days.find((d) => d.id == specialDay.dayId);
        const specialDayClient = {
          id: specialDay.id,
          startDate: new Date(specialDay.year ?? 2021, specialDay.month - 1, specialDay.day),
          annually: specialDay.year == null,
          day: {
            id: specialDayDay.id,
            externalId: specialDayDay.externalId,
            value: specialDayDay.description
          } as UnitCodeListItemClient<number>
        } as SpecialDayUnitClient;
        specialDays.push(specialDayClient);
      });
    }
    touConfigurationClient.specialDays = specialDays;

    return touConfigurationClient;
  }

  /**
   * Find day id (UnitCodeListItemClient) for week by dayId.
   * @param days List of days.
   * @param dayId Day id.
   * @returns Day as code list.
   */
  getDayIdForWeekUnit(days: Array<DayDetailDto>, dayId: string): UnitCodeListItemClient<number> {
    const dayDto = days.find((d) => d.id == dayId);
    const weekDayId = {
      id: dayDto.id,
      externalId: dayDto.externalId,
      value: dayDto.description
    } as UnitCodeListItemClient<number>;

    return weekDayId;
  }

  /**
   * Cast TOU config basic object to ConfigurationUpdateDto type.
   * @param touConfig TouBasicConfigurationClient object.
   * @returns ConfigurationUpdateDto object.
   */
  castTouConfigClientBasicToConfigUpdateDto(touConfig: TouBasicConfigurationClient): ConfigurationUpdateDto {
    const confUpdateDto = {
      externalId: touConfig.externalId,
      description: touConfig.description,
      activation: touConfig.startDate ? moment(touConfig.startDate).format(dateServerFormat) : null,
      state: ConfigurationState.Draft
    } as ConfigurationUpdateDto;

    return confUpdateDto;
  }

  /**
   * Cast TOU unit client for week object to WeekCreateDto type.
   * @param touWeek Unit client - week object.
   * @returns WeekCreateDto object.
   */
  castTouConfigClientWeekToWeekCreateDto(touWeek: UnitClient<number, WeekUnitClient>): WeekCreateDto {
    const weekCreateDto: WeekCreateDto = {
      description: touWeek.description,
      externalId: touWeek.externalId,
      mondayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'mo'),
      tuesdayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'tu'),
      wednesdayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'we'),
      thursdayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'th'),
      fridayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'fr'),
      saturdayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'sa'),
      sundayId: this.findDayInWeekUnitsByDayCode(touWeek.units, 'su')
    };

    return weekCreateDto;
  }

  /**
   * Cast TOU unit client for week object to WeekUpdateDto type.
   * @param touWeek Unit client - week object.
   * @returns WeekUpdateDto object.
   */
  castTouConfigClientWeekToWeekUpdateDto(touWeek: UnitClient<number, WeekUnitClient>): WeekUpdateDto {
    const weekUpdateDto: WeekUpdateDto = this.castTouConfigClientWeekToWeekCreateDto(touWeek) as WeekUpdateDto;

    return weekUpdateDto;
  }

  /**
   * Find day by day code.
   * @param daysOfWeek Days of week
   * @param dayCode Day code
   * @returns Day id
   */
  findDayInWeekUnitsByDayCode(daysOfWeek: Array<WeekUnitClient>, dayCode: string): string {
    const dayOfWeek = daysOfWeek.find((d) => d.dayCode == dayCode);

    return dayOfWeek.day.id;
  }
}

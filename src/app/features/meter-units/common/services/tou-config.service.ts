import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  ConfigurationBasicDto,
  ConfigurationCreateDto,
  ConfigurationDetailDto,
  ConfigurationUpdateDto,
  DayActionConfigCreateDto,
  SeasonCreateDto,
  SeasonUpdateDto,
  SpecialDayCreateDto,
  WeekCreateDto,
  WeekUpdateDto
} from 'src/app/api/time-of-use/models';
import {
  ConfigurationService,
  DayActionService,
  DayService,
  SeasonService,
  SpecialDayService,
  WeekService
} from 'src/app/api/time-of-use/services';
import { StrictHttpResponse } from 'src/app/api/time-of-use/strict-http-response';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { TouConfigurationHelper } from 'src/app/features/helpers/tou-configuration.helper';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { SeasonUnitClient } from 'src/app/models/tou-configuration/SeasonUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { TouBasicConfigurationClient } from 'src/app/models/tou-configuration/TouBasicConfigurationClient';
import { TouConfigurationClient } from 'src/app/models/tou-configuration/TouConfigurationClient';
import { WeekUnitClient } from 'src/app/models/tou-configuration/WeekUnitClient';
import { RepositoryService } from '../../../../core/repository/services/repository.service';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { TouConfigErrorHandler } from '../components/plc-meter-tou-config/tou-config-error-handler/tou-config-error-handler';
import { TouWizardService } from './wizard.service';

@Injectable({
  providedIn: 'root'
})
export class TouConfigService {
  readonly TOU_CONFIG_SESSION_KEY = 'touConfig';
  timeUnits: Array<TimeUnitsClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient>> = [];
  touWizardMode: TouWizardMode;
  touConfigurationClient: TouConfigurationClient;

  // client data

  constructor(
    private repository: RepositoryService,
    private router: Router,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private touWizard: TouWizardService,
    private touConfigurationService: ConfigurationService,
    private touConfigHelper: TouConfigurationHelper,
    private dayService: DayService,
    private dayActionService: DayActionService,
    private weekService: WeekService,
    private specialDayService: SpecialDayService,
    private touConfigErrorHelper: TouConfigErrorHandler,
    private seasonService: SeasonService
  ) {
    this.initTimeUnits();
  }

  // client data
  getTimeUnits(type: TimeUnitClientType) {
    return this.timeUnits.find((unit) => unit.type === type);
  }

  createNewTouConfigurationClient() {
    this.touWizardMode = TouWizardMode.CREATE;
    this.loadTOUConfigurationFromSession();
    if (!this.touConfigurationClient) {
      this.touConfigurationClient = {
        basic: {
          id: null,
          externalId: null,
          description: ''
        },
        specialDays: []
      };
      this.initTimeUnits();
      this.touWizard.setMenuItemsInitValues();
    }
  }

  saveBasicStep(data: TouBasicConfigurationClient) {
    this.touConfigurationClient.basic = data;
    this.storeTOUConfigurationToSession();
  }

  getTouConfig() {
    return this.touConfigurationClient;
  }

  addSpecialDays(days: any[]) {
    this.touConfigurationClient.specialDays = days;
    this.storeTOUConfigurationToSession();
  }

  saveTouConfiguration(loading: boolean) {
    if (this.touWizardMode == TouWizardMode.CREATE) {
      const configCreateDto: ConfigurationCreateDto = this.touConfigHelper.castTouConfigurationClientToConfigurationCreateDto(
        this.touConfigurationClient
      );

      this.addTouConfiguration(configCreateDto).subscribe(
        (res) => {
          loading = false;
          this.removeTOUConfigurationFromSession();
          this.createNewTouConfigurationClient();
          this.toast.successToast(this.translate.instant('TOU-CONFIG.SAVE-TOU-SUCCESSFUL'));
          this.router.navigate(['/configuration/importTouConfiguration/list']);
        },
        (err: HttpErrorResponse) => {
          loading = false;
          this.toast.errorToast(this.translate.instant('TOU-CONFIG.SAVE-ERROR'));
          this.touConfigErrorHelper.showErrorsAsToasts(err);
        }
      );
    }
  }

  initTimeUnits() {
    this.timeUnits = [];
    this.timeUnits.push(
      {
        type: TimeUnitClientType.DAY,
        units: []
      },
      {
        type: TimeUnitClientType.WEEK,
        units: []
      },
      {
        type: TimeUnitClientType.SEASON,
        units: []
      }
    );
  }

  storeTOUConfigurationToSession() {
    if (this.touWizardMode == TouWizardMode.CREATE) {
      sessionStorage.setItem(this.TOU_CONFIG_SESSION_KEY, JSON.stringify(this.touConfigurationClient));
    }
  }

  loadTOUConfigurationFromSession() {
    if (this.touWizardMode == TouWizardMode.CREATE) {
      this.touConfigurationClient = JSON.parse(sessionStorage.getItem(this.TOU_CONFIG_SESSION_KEY));
    }
  }

  removeTOUConfigurationFromSession() {
    sessionStorage.removeItem(this.TOU_CONFIG_SESSION_KEY);
  }

  isConfigurationValid() {
    if (this.touConfigurationClient.days.units.find((item) => item.units.length === 0)) {
      return false;
    } else {
      return (
        this.touConfigurationClient.days.units.length > 0 &&
        this.touConfigurationClient.weeks.units.length > 0 &&
        this.touConfigurationClient.seasons.units.length > 0
      );
    }
  }

  //#region Backend calls

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

  updateBasicConfiguration(id: string, confBasicUpdate: ConfigurationUpdateDto): Observable<void> {
    return this.touConfigurationService.configurationsConfigurationIdPut({ configurationId: id, body: confBasicUpdate });
  }

  updateDay(dayId: string, description: string, externalId: number): Observable<void> {
    return this.dayService.configurationsConfigurationIdDaysDayIdPut({
      configurationId: this.touConfigurationClient.basic.id,
      dayId: dayId,
      body: {
        description: description,
        externalId: externalId
      }
    });
  }

  addDayActionToDay(dayId: string, hour: number, minute: number, scriptId: number): Observable<string> {
    return this.dayActionService.configurationsConfigurationIdDaysDayIdDayActionsPost$Json({
      configurationId: this.touConfigurationClient.basic.id,
      dayId: dayId,
      body: {
        hour: hour,
        minute: minute,
        scriptActionId: scriptId
      }
    });
  }

  deleteDayAction(dayId: string, dayActionId: string): Observable<void> {
    return this.dayActionService.configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete({
      configurationId: this.touConfigurationClient.basic.id,
      dayId: dayId,
      dayActionId: dayActionId
    });
  }

  addWeek(configurationId: string, weekCreateDto: WeekCreateDto): Observable<string> {
    return this.weekService.configurationsConfigurationIdWeeksPost$Json({ configurationId, body: weekCreateDto });
  }

  updateWeek(configurationId: string, weekId: string, weekUpdateDto: WeekUpdateDto): Observable<void> {
    return this.weekService.configurationsConfigurationIdWeeksWeekIdPut({
      configurationId: configurationId,
      weekId: weekId,
      body: weekUpdateDto
    });
  }

  canDeleteWeek(configurationId: string, weekId: string): Observable<boolean> {
    return this.weekService.configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json({ configurationId: configurationId, weekId: weekId });
  }

  deleteWeek(configurationId: string, weekId: string): Observable<void> {
    return this.weekService.configurationsConfigurationIdWeeksWeekIdDelete({ configurationId: configurationId, weekId: weekId });
  }

  addSpecialDay(configurationId: string, specialDayCreateDto: SpecialDayCreateDto): Observable<StrictHttpResponse<string>> {
    return this.specialDayService.configurationsConfigurationIdSpecialDaysPost$Plain$Response({
      configurationId: configurationId,
      body: specialDayCreateDto
    });
  }

  deleteSpecialDay(configurationId: string, specialDayId: string): Observable<void> {
    return this.specialDayService.configurationsConfigurationIdSpecialDaysSpecialDayIdDelete({
      configurationId: configurationId,
      specialDayId: specialDayId
    });
  }

  addDay(dayExternalId: number, description: string, dayActions: Array<DayActionConfigCreateDto>): Observable<string> {
    return this.dayService.configurationsConfigurationIdDaysPost$Json({
      configurationId: this.touConfigurationClient.basic.id,
      body: {
        description: description,
        externalId: dayExternalId,
        dayActions: dayActions
      }
    });
  }

  deleteDay(dayId: string): Observable<void> {
    return this.dayService.configurationsConfigurationIdDaysDayIdDelete({
      configurationId: this.touConfigurationClient.basic.id,
      dayId: dayId
    });
  }

  updateSeason(seasonId: string, seasonUpdateDto: SeasonUpdateDto): Observable<void> {
    return this.seasonService.configurationsConfigurationIdSeasonsSeasonIdPut({
      configurationId: this.touConfigurationClient.basic.id,
      seasonId: seasonId,
      body: seasonUpdateDto
    });
  }

  createSeason(seasonCreateDto: SeasonCreateDto) {
    return this.seasonService.configurationsConfigurationIdSeasonsPost$Json({
      configurationId: this.touConfigurationClient.basic.id,
      body: seasonCreateDto
    });
  }

  deleteSeason(seasonId: string): Observable<StrictHttpResponse<void>> {
    return this.seasonService.configurationsConfigurationIdSeasonsSeasonIdDelete$Response({
      configurationId: this.touConfigurationClient.basic.id,
      seasonId: seasonId
    });
  }

  //#endregion
}

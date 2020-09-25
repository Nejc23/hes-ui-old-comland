import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, materialize, dematerialize, mergeMap } from 'rxjs/operators';
import { CodelistInterceptor } from './codelist.interceptor';
import { AuthenticateInterceptor } from './authentication/authenticate.interceptor';
import { UserRequestResetPasswordInterceptor } from './authentication/user-request-reset-password.interceptor';
import { UserChangePasswordInterceptor } from './authentication/user-change-password.interceptor';
import { UserNewPasswordInterceptor } from './authentication/user-new-password.interceptor';
import { DataConcentratorUnitsListInterceptor } from './data-concentrator-units/data-concentrator-units-list.interceptor';
import { DcuGridLayoutInterceptor } from './data-concentrator-units/dcu-grid-layout.interceptor';
import { DataConcentratorUnitInterceptor } from './data-concentrator-units/data-concentrator-unit.interceptor';
import { MeterUnitsListInterceptor } from './meter-units/meter-units-list.interceptor';
import { MeterUnitsTypeGridLayoutInterceptor } from './meter-units/meter-units-type-grid-layout.interceptor';
import { MeterUnitCodelistInterceptor } from './meter-units/code-lists.interceptor';
import { RegistersSelectInterceptor } from './registers-select/registers-select.interceptor';
import { MeterUnitsSchedulerInterceptor } from './meter-units/meter-units-scheduler.interceptor';
import { TimeOfUseInterceptor } from './time-of-use/time-of-use.interceptor';
import { SchedulerJobsInterceptor } from './jobs/scheduler-jobs.interceptor';
import { ActiveJobsInterceptor } from './jobs/active-jobs.interceptor';
import { MeterUnitsFwUpgradeInterceptor } from './meter-units/meter-units-fw-upgrade.interceptor';
import { JobsCodelistInterceptor } from './jobs/jobs-codelist.interceptor';
import { AutoTemplatesListInterceptor } from './configuration/auto-templates/auto-templates-list.interceptor';
import { AutoTemplatesRulesListInterceptor } from './configuration/auto-templates/auto-templates-rules-list.interceptor';
import { AutoTemplatesRulesInterceptor } from './configuration/auto-templates/auto-templates-rules.interceptor';
import { MeterUnitsActivateUpgradeInterceptor } from './meter-units/meter-units-activate-upgrade.interceptor';
import { MeterUnitsForJobInterceptor } from './meter-units/meter-units-for-job.interceptor';
import { AutoTemplatesReadingJobsListInterceptor } from './configuration/auto-templates/auto-templates-reading-jobs-list.interceptor';
import { MeterUnitsSetMonitorInterceptor } from './meter-units/meter-units-set-monitor.interceptor';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
    this.setVariables();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('/apigrid/') < 0) {
      console.log(`${request.method} ${request.url}`);
      return (
        of(null)
          .pipe(
            mergeMap(() => {
              // DCU
              if (DataConcentratorUnitsListInterceptor.canInterceptDataConcentratorUnitsList(request)) {
                return DataConcentratorUnitsListInterceptor.interceptDataConcentratorUnitsList(request);
              }

              if (DcuGridLayoutInterceptor.canInterceptDcuLayoutGet(request)) {
                return DcuGridLayoutInterceptor.interceptDcuLayoutGet();
              }

              if (DcuGridLayoutInterceptor.canInterceptDcuLayoutPost(request)) {
                return DcuGridLayoutInterceptor.interceptDcuLayoutPost(request);
              }

              if (DataConcentratorUnitInterceptor.canInterceptDcuCreatePost(request)) {
                return DataConcentratorUnitInterceptor.interceptDcuCreatePost(request);
              }

              if (DcuGridLayoutInterceptor.canInterceptDcuLayoutPut(request)) {
                return DcuGridLayoutInterceptor.interceptDcuLayoutPut(request);
              }

              if (DcuGridLayoutInterceptor.canInterceptDcuLayoutDelete(request)) {
                return DcuGridLayoutInterceptor.interceptDcuLayoutDelete(request);
              }

              // registers
              if (RegistersSelectInterceptor.canInterceptMeterUnitRegisters(request)) {
                return RegistersSelectInterceptor.interceptMeterUnitRegisters(request);
              }

              // TOU
              if (TimeOfUseInterceptor.canInterceptTouConfigList(request)) {
                return TimeOfUseInterceptor.interceptTouConfigList(request);
              }

              // scheduled jobs
              if (SchedulerJobsInterceptor.canInterceptSchedulerJobsList(request)) {
                return SchedulerJobsInterceptor.interceptSchedulerJobsList(request);
              }
              if (SchedulerJobsInterceptor.canInterceptAddNewScheduleDevice(request)) {
                return SchedulerJobsInterceptor.interceptAddNewScheduleDevice(request);
              }

              if (SchedulerJobsInterceptor.canInterceptSchedulerJobs(request)) {
                return SchedulerJobsInterceptor.interceptSchedulerJobs();
              }

              if (SchedulerJobsInterceptor.canInterceptSchedulerActiveJobsList(request)) {
                return SchedulerJobsInterceptor.interceptSchedulerActiveJobsList(request);
              }

              // active jobs
              if (ActiveJobsInterceptor.canInterceptActiveJobs(request)) {
                return ActiveJobsInterceptor.interceptActiveJobs(request);
              }

              // codelists jobs
              if (JobsCodelistInterceptor.canInterceptTimeUnitCode(request)) {
                return JobsCodelistInterceptor.interceptTimeUnitCode();
              }
              if (JobsCodelistInterceptor.canInterceptJobsDiscoveryJobs(request)) {
                return JobsCodelistInterceptor.interceptJobsDiscoveryJobs();
              }

              // codelists dcu
              if (CodelistInterceptor.canInterceptDcuStatus(request)) {
                return CodelistInterceptor.interceptDcuStatus();
              }
              if (CodelistInterceptor.canInterceptDcuTag(request)) {
                return CodelistInterceptor.interceptDcuTag();
              }
              if (CodelistInterceptor.canInterceptDcuType(request)) {
                return CodelistInterceptor.interceptDcuType();
              }
              if (CodelistInterceptor.canInterceptDcuVendor(request)) {
                return CodelistInterceptor.interceptDcuVendor();
              }
              if (CodelistInterceptor.canInterceptCompanies(request)) {
                return CodelistInterceptor.interceptCompanies(request);
              }
              if (CodelistInterceptor.canInterceptGetRegisters(request)) {
                return CodelistInterceptor.interceptGetRegisters();
              }

              // meter unit codelists
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitType(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitType();
              }
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitStatus(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitStatus();
              }
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitVendor(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitVendor();
              }
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitTag(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitTag();
              }
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitFirmware(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitFirmware();
              }
              if (MeterUnitCodelistInterceptor.canInterceptMeterUnitBreakerState(request)) {
                return MeterUnitCodelistInterceptor.interceptMeterUnitBreakerState();
              }

              // authenticate
              if (AuthenticateInterceptor.canInterceptAuthenticateUser(request)) {
                return AuthenticateInterceptor.interceptAuthenticateUser();
              }
              if (AuthenticateInterceptor.canInterceptAuthenticateDevelopUser(request)) {
                return AuthenticateInterceptor.interceptAuthenticateDevelopUser();
              }
              if (AuthenticateInterceptor.canInterceptRefreshToken(request)) {
                return AuthenticateInterceptor.interceptRefreshToken();
              }
              if (UserRequestResetPasswordInterceptor.canInterceptUserRequestResetPassword(request)) {
                return UserRequestResetPasswordInterceptor.interceptUserRequestResetPassword();
              }
              if (UserChangePasswordInterceptor.canInterceptUserChangePassword(request)) {
                return UserChangePasswordInterceptor.interceptUserChangePassword();
              }
              if (UserNewPasswordInterceptor.canInterceptUserNewPassword(request)) {
                return UserNewPasswordInterceptor.interceptUserNewPassword();
              }

              // meter Units
              if (MeterUnitsListInterceptor.canInterceptMeterUnitsList(request)) {
                return MeterUnitsListInterceptor.interceptMeterUnitsList(request);
              }

              if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutGet(request)) {
                return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutGet();
              }

              if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutPost(request)) {
                return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutPost(request);
              }

              if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutPut(request)) {
                return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutPut(request);
              }

              if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutDelete(request)) {
                return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutDelete(request);
              }

              if (MeterUnitsSchedulerInterceptor.canInterceptMeterUnitSchedulerPost(request)) {
                return MeterUnitsSchedulerInterceptor.interceptMeterUnitSchedulerPost(request);
              }

              if (MeterUnitsSchedulerInterceptor.canInterceptSchedulerJobDelete(request)) {
                return MeterUnitsSchedulerInterceptor.interceptSchedulerJobDelete(request);
              }

              if (MeterUnitsSchedulerInterceptor.canInterceptSchedulerJobExecute(request)) {
                return MeterUnitsSchedulerInterceptor.interceptSchedulerJobExecute(request);
              }

              if (MeterUnitsSchedulerInterceptor.canInterceptSchedulerJobEnable(request)) {
                return MeterUnitsSchedulerInterceptor.interceptSchedulerJobEnable(request);
              }

              if (MeterUnitsSchedulerInterceptor.canInterceptSchedulerJobDisable(request)) {
                return MeterUnitsSchedulerInterceptor.interceptSchedulerJobDisable(request);
              }

              if (MeterUnitsFwUpgradeInterceptor.canInterceptMeterUniFwUpgradeUploadPost(request)) {
                return MeterUnitsFwUpgradeInterceptor.interceptMeterUniFwUpgradeUploadPost(request);
              }

              if (MeterUnitsFwUpgradeInterceptor.canInterceptMeterUniFwUpgradePost(request)) {
                return MeterUnitsFwUpgradeInterceptor.interceptMeterUniFwUpgradePost(request);
              }

              if (MeterUnitsListInterceptor.canInterceptMeterUnitsList(request)) {
                return MeterUnitsFwUpgradeInterceptor.interceptMeterUniFwUpgradePost(request);
              }

              if (MeterUnitsActivateUpgradeInterceptor.canInterceptActivateDeviceUpgradePost(request)) {
                return MeterUnitsActivateUpgradeInterceptor.interceptActivateDeviceUpgradePost(request);
              }

              if (MeterUnitsForJobInterceptor.canInterceptMeterUnitsForJob(request)) {
                return MeterUnitsForJobInterceptor.interceptMeterUnitsForJobPost(request);
              }

              if (MeterUnitsSetMonitorInterceptor.canInterceptMeterUnitGetCommonRegisterGroupsPost(request)) {
                return MeterUnitsSetMonitorInterceptor.interceptMeterUnitGetCommonRegisterGroupsPost();
              }

              // auto-templates
              if (AutoTemplatesListInterceptor.canInterceptAutoTemplatesList(request)) {
                return AutoTemplatesListInterceptor.interceptAutoTemplatesList(request);
              }

              if (AutoTemplatesRulesListInterceptor.canInterceptAutoTemplatesRulesList(request)) {
                return AutoTemplatesRulesListInterceptor.interceptAutoTemplatesRulesList(request);
              }

              if (AutoTemplatesRulesInterceptor.canInterceptAutoTemplatesRulePost(request)) {
                return AutoTemplatesRulesInterceptor.interceptAutoTemplatesRulePost(request);
              }

              if (AutoTemplatesRulesInterceptor.canInterceptAutoTemplatesRuleUpdate(request)) {
                return AutoTemplatesRulesInterceptor.interceptAutoTemplatesRuleUpdate(request);
              }

              if (AutoTemplatesRulesInterceptor.canInterceptAutoTemplatesRuleDelete(request)) {
                return AutoTemplatesRulesInterceptor.interceptAutoTemplatesRuleDelete(request);
              }

              if (AutoTemplatesRulesInterceptor.canInterceptAutoTemplatesRuleGet(request)) {
                return AutoTemplatesRulesInterceptor.interceptAutoTemplatesRuleGet(request);
              }

              if (CodelistInterceptor.canInterceptReadingJobList(request)) {
                return CodelistInterceptor.interceptReadingJobList();
              }

              if (AutoTemplatesReadingJobsListInterceptor.canInterceptAutoTemplatesReadingJobsList(request)) {
                return AutoTemplatesReadingJobsListInterceptor.interceptAutoTemplatesReadingJobsList(request);
              }

              // pass through any requests not handled above
              return next.handle(request);
            })
          )

          // call materialize and dematerialize to ensure delay even if an error is thrown
          // (https://github.com/Reactive-Extensions/RxJS/issues/648)
          .pipe(materialize())
          .pipe(delay(500))
          .pipe(dematerialize())
      );
    } else {
      return next.handle(request);
    }
  }

  setVariables() {
    //
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

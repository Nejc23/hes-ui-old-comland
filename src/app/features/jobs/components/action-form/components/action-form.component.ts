import { SchedulerJobsListGridService } from './../../../services/scheduler-jobs-list-grid.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  searchTextEmpty = true;
  sessionNameForGridState = 'grdStateJobs';

  columns$: Codelist<string>[] = [];

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  private eventSettingsStoreLoadedSubscription: Subscription;

  constructor(
    public fb: FormBuilder,
    public staticTextService: ActionFormStaticTextService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private schedulerJobsListGridService: SchedulerJobsListGridService
  ) {}

  ngOnInit() {
    // this.staticTextService.preventCloseDropDownWhenClickInsideMenu();

    const searchText = this.schedulerJobsListGridService.getSessionSettingsSearchedText();
    this.form = this.createForm(searchText === '' ? null : searchText);

    this.eventSettingsStoreLoadedSubscription = this.settingsStoreEmitterService.eventEmitterSettingsLoaded.subscribe(() => {
      const searchTextUpdated = this.schedulerJobsListGridService.getSessionSettingsSearchedText();
      this.form.get(this.searchProperty).setValue(searchTextUpdated === '' ? null : searchTextUpdated);
    });
  }

  insertedValue($event: string) {
    if ($event !== undefined && $event) {
      this.searchTextEmpty = $event.length === 0;
    } else {
      this.searchTextEmpty = true;
    }
    this.searchChange.emit($event);
  }

  get searchProperty() {
    return 'content';
  }
  createForm(search: string): FormGroup {
    return this.fb.group({
      ['content']: search
    });
  }

  onFilter() {}

  onRefresh() {
    this.refresh.emit();
  }

  ngOnDestroy() {
    this.staticTextService.removePopupBackdropIfClickOnMenu();

    if (this.eventSettingsStoreLoadedSubscription) {
      this.eventSettingsStoreLoadedSubscription.unsubscribe();
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { EventManagerService } from 'src/app/core/services/event-manager.service';

export interface MenuItem {
  item: string; // TODO ENUM
  stepIndex: number;
  label: string;
  enabled: boolean;
  completed: boolean;
  url: string;
}

export interface StepModel {
  stepIndex: number;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TouWizardService {
  menuItems: Array<MenuItem> = [
    {
      item: 'basic',
      stepIndex: 1,
      label: 'TOU-CONFIG.BASICS',
      enabled: true,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/basic'
    },
    {
      item: 'days',
      stepIndex: 2,
      label: 'TOU-CONFIG.DAY-TABLES',
      enabled: false,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/day'
    },
    {
      item: 'weeks',
      stepIndex: 3,
      label: 'TOU-CONFIG.WEEK-TABLES',
      enabled: false,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/week'
    },
    {
      item: 'seasons',
      stepIndex: 4,
      label: 'TOU-CONFIG.SEASON-TABLES',
      enabled: false,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/season'
    },
    {
      item: 'specialDays',
      stepIndex: 5,
      label: 'TOU-CONFIG.SPECIAL-DAYS',
      enabled: false,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/special'
    },
    {
      item: 'summary',
      stepIndex: 6,
      label: 'TOU-CONFIG.SUMMARY',
      enabled: false,
      completed: false,
      url: '/configuration/importTouConfiguration/wizard/summary'
    }
  ];

  steps = [
    { stepIndex: 1, completed: false },
    { stepIndex: 2, completed: false },
    { stepIndex: 3, completed: false },
    { stepIndex: 4, completed: false },
    { stepIndex: 5, completed: false },
    { stepIndex: 6, completed: false }
  ];

  stepsEvent: BehaviorSubject<StepModel[]> = new BehaviorSubject<StepModel[]>(this.steps);
  currentStepEvent: BehaviorSubject<StepModel> = new BehaviorSubject<StepModel>(null);
  menuItemsEvent: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.menuItems);

  constructor(private router: Router, private eventsService: EventManagerService) {
    this.currentStepEvent.next(this.stepsEvent.value[0]);

    this.eventsService.getCustom('UpdateWizardStepCompleteness').subscribe((step: StepModel) => {
      const currentItem = this.menuItems.find((data) => data.stepIndex === step.stepIndex);
      if (currentItem) {
        currentItem.completed = step.completed;
      }
    });

    this.eventsService.getCustom('EnableAllWizardSteps').subscribe(() => {
      this.menuItems.map((x) => {
        // All steps are clickable in the Wizard step list
        x.enabled = true;
        // All steps but the last two get the green check mark
        if (x.stepIndex < 5) {
          x.completed = true;
        }
      });
    });
  }

  setCurrentStep(step: StepModel): void {
    this.currentStepEvent.next(step);
  }

  getCurrentStep(): Observable<StepModel> {
    return this.currentStepEvent.asObservable();
  }

  getSteps(): Observable<StepModel[]> {
    return this.stepsEvent.asObservable();
  }

  moveToNextStep(): void {
    const index = this.currentStepEvent.value.stepIndex;
    const currentItem = this.menuItems.find((data) => data.stepIndex === index);
    currentItem.completed = currentItem.stepIndex < 5;

    if (index < this.stepsEvent.value.length) {
      this.currentStepEvent.next(this.stepsEvent.value[index]);
      const nextItem = this.menuItems.find((data) => data.stepIndex === index + 1);
      nextItem.enabled = true;
      this.router.navigate([nextItem.url]); // navigate to next page
    }
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItemsEvent.asObservable();
  }

  setMenuItemsInitValues() {
    this.menuItems.forEach((item) => {
      if (item.stepIndex !== 1) {
        item.enabled = false;
      }
      item.completed = false;
    });
  }
}

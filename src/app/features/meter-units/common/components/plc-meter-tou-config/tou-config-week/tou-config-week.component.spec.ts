import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigWeekComponent } from './tou-config-week.component';

describe('TouConfigWeekComponent', () => {
  let component: TouConfigWeekComponent;
  let fixture: ComponentFixture<TouConfigWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigWeekComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

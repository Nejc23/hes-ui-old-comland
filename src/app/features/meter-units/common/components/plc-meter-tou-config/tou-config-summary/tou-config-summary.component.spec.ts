import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigSummaryComponent } from './tou-config-summary.component';

describe('TouConfigSummaryComponent', () => {
  let component: TouConfigSummaryComponent;
  let fixture: ComponentFixture<TouConfigSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigSummaryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

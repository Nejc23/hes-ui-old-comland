import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigDayComponent } from './tou-config-day.component';

describe('TouConfigDayComponent', () => {
  let component: TouConfigDayComponent;
  let fixture: ComponentFixture<TouConfigDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigDayComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

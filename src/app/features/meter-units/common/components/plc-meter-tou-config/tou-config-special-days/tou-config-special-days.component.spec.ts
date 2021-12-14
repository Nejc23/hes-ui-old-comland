import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigSpecialDaysComponent } from './tou-config-special-days.component';

describe('TouConfigSpecialDaysComponent', () => {
  let component: TouConfigSpecialDaysComponent;
  let fixture: ComponentFixture<TouConfigSpecialDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigSpecialDaysComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigSpecialDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

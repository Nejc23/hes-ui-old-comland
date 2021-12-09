import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigSeasonComponent } from './tou-config-season.component';

describe('TouConfigSeasonComponent', () => {
  let component: TouConfigSeasonComponent;
  let fixture: ComponentFixture<TouConfigSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigSeasonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

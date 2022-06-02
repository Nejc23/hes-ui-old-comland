import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsDetailComponent } from './configurations-detail.component';

describe('ConfigurationsDetailComponent', () => {
  let component: ConfigurationsDetailComponent;
  let fixture: ComponentFixture<ConfigurationsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigurationsDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

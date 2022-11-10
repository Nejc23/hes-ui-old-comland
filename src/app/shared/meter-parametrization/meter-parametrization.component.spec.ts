import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterParametrizationComponent } from './meter-parametrization.component';

describe('MeterParametrizationComponent', () => {
  let component: MeterParametrizationComponent;
  let fixture: ComponentFixture<MeterParametrizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeterParametrizationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterParametrizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

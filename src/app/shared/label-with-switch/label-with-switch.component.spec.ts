import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelWithSwitchComponent } from './label-with-switch.component';

describe('LabelWithSwitchComponent', () => {
  let component: LabelWithSwitchComponent;
  let fixture: ComponentFixture<LabelWithSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelWithSwitchComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelWithSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

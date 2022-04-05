import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveJobCardItemComponent } from './active-job-card-item.component';

describe('ActiveJobCardItemComponent', () => {
  let component: ActiveJobCardItemComponent;
  let fixture: ComponentFixture<ActiveJobCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveJobCardItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveJobCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

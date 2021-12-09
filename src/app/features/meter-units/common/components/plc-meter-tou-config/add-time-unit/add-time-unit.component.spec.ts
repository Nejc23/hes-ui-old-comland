import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeUnitComponent } from './add-time-unit.component';

describe('AddTimeUnitComponent', () => {
  let component: AddTimeUnitComponent;
  let fixture: ComponentFixture<AddTimeUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTimeUnitComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimeUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

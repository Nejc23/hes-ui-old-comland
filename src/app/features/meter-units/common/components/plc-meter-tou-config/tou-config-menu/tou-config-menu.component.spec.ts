import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigMenuComponent } from './tou-config-menu.component';

describe('TouConfigMenuComponent', () => {
  let component: TouConfigMenuComponent;
  let fixture: ComponentFixture<TouConfigMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigMenuComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

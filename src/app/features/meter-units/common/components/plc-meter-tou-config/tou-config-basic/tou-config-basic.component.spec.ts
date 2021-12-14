import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigBasicComponent } from './tou-config-basic.component';

describe('TouConfigBasicComponent', () => {
  let component: TouConfigBasicComponent;
  let fixture: ComponentFixture<TouConfigBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigBasicComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

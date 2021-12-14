import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouConfigListComponent } from './tou-config-list.component';

describe('TouConfigListComponent', () => {
  let component: TouConfigListComponent;
  let fixture: ComponentFixture<TouConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouConfigListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

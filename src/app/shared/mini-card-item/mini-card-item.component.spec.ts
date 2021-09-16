import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCardItemComponent } from './mini-card-item.component';

describe('MiniCardItemComponent', () => {
  let component: MiniCardItemComponent;
  let fixture: ComponentFixture<MiniCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniCardItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaQualityWidgetComponent } from './sla-quality-widget.component';

describe('SlaQuailityWidgetComponent', () => {
  let component: SlaQualityWidgetComponent;
  let fixture: ComponentFixture<SlaQualityWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlaQualityWidgetComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaQualityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

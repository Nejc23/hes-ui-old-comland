import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOutComponentComponent } from './slide-out-component.component';

describe('SlideOutComponentComponent', () => {
  let component: SlideOutComponentComponent;
  let fixture: ComponentFixture<SlideOutComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlideOutComponentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideOutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

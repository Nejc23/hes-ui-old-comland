import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableToolbarComponent } from './data-table-toolbar.component';

describe('DataTableToolbarComponent', () => {
  let component: DataTableToolbarComponent;
  let fixture: ComponentFixture<DataTableToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableToolbarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

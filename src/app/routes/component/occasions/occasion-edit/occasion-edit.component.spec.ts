import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionEditComponent } from './occasion-edit.component';

describe('OccasionEditComponent', () => {
  let component: OccasionEditComponent;
  let fixture: ComponentFixture<OccasionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccasionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

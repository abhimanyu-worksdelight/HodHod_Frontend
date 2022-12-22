import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccasionAddComponent } from './occasion-add.component';

describe('OccasionAddComponent', () => {
  let component: OccasionAddComponent;
  let fixture: ComponentFixture<OccasionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccasionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccasionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

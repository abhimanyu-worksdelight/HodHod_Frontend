import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSectionsAddComponent } from './home-sections-add.component';

describe('HomeSectionsAddComponent', () => {
  let component: HomeSectionsAddComponent;
  let fixture: ComponentFixture<HomeSectionsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSectionsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSectionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

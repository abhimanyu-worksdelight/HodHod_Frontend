import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSectionsEditComponent } from './home-sections-edit.component';

describe('HomeSectionsEditComponent', () => {
  let component: HomeSectionsEditComponent;
  let fixture: ComponentFixture<HomeSectionsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSectionsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSectionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

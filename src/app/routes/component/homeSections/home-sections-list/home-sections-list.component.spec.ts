import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSectionsListComponent } from './home-sections-list.component';

describe('HomeSectionsListComponent', () => {
  let component: HomeSectionsListComponent;
  let fixture: ComponentFixture<HomeSectionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSectionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListingComponent } from './user-listing.component';

describe('UsersListingComponent', () => {
  let component: UsersListingComponent;
  let fixture: ComponentFixture<UsersListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesAddComponent } from './user-roles-add.component';

describe('UserRolesAddComponent', () => {
  let component: UserRolesAddComponent;
  let fixture: ComponentFixture<UserRolesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRolesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

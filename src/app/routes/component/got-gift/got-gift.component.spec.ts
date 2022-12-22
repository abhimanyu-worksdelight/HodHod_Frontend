import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotGiftComponent } from './got-gift.component';

describe('GotGiftComponent', () => {
  let component: GotGiftComponent;
  let fixture: ComponentFixture<GotGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GotGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GotGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

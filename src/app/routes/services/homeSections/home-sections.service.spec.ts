import { TestBed } from '@angular/core/testing';
import { HomeSectionsService } from './home-sections.service';

describe('HomeSectionsService', () => {
  let service: HomeSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

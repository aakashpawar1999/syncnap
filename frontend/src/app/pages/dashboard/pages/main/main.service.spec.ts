import { TestBed } from '@angular/core/testing';

import { MainService } from './main.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('MainService', () => {
  let service: MainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(MainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

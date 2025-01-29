import { TestBed } from '@angular/core/testing';

import { SettingService } from './setting.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(SettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

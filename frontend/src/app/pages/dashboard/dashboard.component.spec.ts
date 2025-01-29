import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        HttpClient,
        ToastrService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Mock route parameters
            queryParams: of({ q: 'test' }), // Mock query parameters (if used)
            snapshot: { params: { id: '123' } }, // Mock snapshot (if used)
          },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should create', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/v1/user/details');
    expect(req.request.method).toBe('GET');
    req.flush({}); // Provide a mock response
    expect(component).toBeTruthy();
  });
});

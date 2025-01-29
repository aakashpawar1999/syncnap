import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncLogComponent } from './sync-log.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('SyncLogComponent', () => {
  let component: SyncLogComponent;
  let fixture: ComponentFixture<SyncLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncLogComponent, ToastrModule.forRoot()],
      providers: [HttpClient, HttpHandler, ToastrService],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

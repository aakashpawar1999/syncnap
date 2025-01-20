import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncLogComponent } from './sync-log.component';

describe('SyncLogComponent', () => {
  let component: SyncLogComponent;
  let fixture: ComponentFixture<SyncLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

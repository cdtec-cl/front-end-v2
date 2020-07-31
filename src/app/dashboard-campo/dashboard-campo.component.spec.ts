import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCampoComponent } from './dashboard-campo.component';

describe('DashboardComponent', () => {
  let component: DashboardCampoComponent;
  let fixture: ComponentFixture<DashboardCampoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCampoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

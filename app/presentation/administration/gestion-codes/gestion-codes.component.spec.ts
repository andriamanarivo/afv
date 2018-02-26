import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCodesComponent } from './gestion-codes.component';

describe('GestionCodesComponent', () => {
  let component: GestionCodesComponent;
  let fixture: ComponentFixture<GestionCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

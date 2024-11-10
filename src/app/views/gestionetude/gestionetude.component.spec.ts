import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionetudeComponent } from './gestionetude.component';

describe('GestionetudeComponent', () => {
  let component: GestionetudeComponent;
  let fixture: ComponentFixture<GestionetudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionetudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionetudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

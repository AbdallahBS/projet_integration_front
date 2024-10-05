import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionenseignantComponent } from './gestionenseignant.component';

describe('GestionenseignantComponent', () => {
  let component: GestionenseignantComponent;
  let fixture: ComponentFixture<GestionenseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionenseignantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionenseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

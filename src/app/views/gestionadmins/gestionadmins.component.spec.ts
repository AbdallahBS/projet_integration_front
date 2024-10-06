import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionadminsComponent } from './gestionadmins.component';

describe('GestionadminsComponent', () => {
  let component: GestionadminsComponent;
  let fixture: ComponentFixture<GestionadminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionadminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionadminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

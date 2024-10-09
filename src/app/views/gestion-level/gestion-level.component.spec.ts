import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelComponent } from './gestion-level.component';

describe('GestionLevelComponent', () => {
  let component: LevelComponent;
  let fixture: ComponentFixture<LevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

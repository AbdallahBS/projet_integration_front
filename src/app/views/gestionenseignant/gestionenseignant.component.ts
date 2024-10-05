import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnseignantService } from '../../services/enseignant.service'; // New service for enseignants
import { Enseignant } from '../../models/enseignant.model'; // Update to Enseignant model
import { CommonModule } from '@angular/common';
import {
  AvatarComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-gestionenseignant',
  standalone: true,
  imports: [
    ColComponent,
    FormsModule,
    AvatarComponent,
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    CardSubtitleDirective,
    CardLinkDirective,
    CardFooterComponent,
    CardGroupComponent,
    CardImgDirective,
    ReactiveFormsModule
  ],
  templateUrl: './gestionenseignant.component.html',
  styleUrls: ['./gestionenseignant.component.scss']
})
export class GestionenseignantComponent implements OnInit {
  selectedEnseignantId: number | null | undefined = null;
  enseignants: Enseignant[] = [];
  enseignantForm!: FormGroup;
  showForm = false;
  isSubmitting = false;
  searchName: string = '';
  searchClass: string = '';
  filteredEnseignants: Enseignant[] = [];


  constructor(private enseignantService: EnseignantService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchAllEnseignants();
    this.initEnseignantForm();
  }

  fetchAllEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data;
        this.filteredEnseignants = data;
      },
      error: (error) => {
        console.error('Error fetching enseignants', error);
      }
    });
  }

  initEnseignantForm(): void {
    this.enseignantForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      numerotel: ['', [Validators.required]],
      classe: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.enseignantForm.valid) {
      this.isSubmitting = true;
      const enseignantData = this.enseignantForm.value;

      if (this.selectedEnseignantId) {
        // Update existing enseignant
        this.enseignantService.updateEnseignant(this.selectedEnseignantId, enseignantData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEnseignants();
            this.selectedEnseignantId = null;
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating enseignant', error);
          }
        });
      } else {
        // Add a new enseignant
        this.enseignantService.addEnseignant(enseignantData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEnseignants();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding enseignant', error);
          }
        });
      }
    }
  }

  deleteEnseignant(enseignantId: number | undefined): void {
    if (enseignantId === undefined) {
      console.error('Enseignant ID is undefined');
      return;  // Prevent further execution if id is undefined
    }
  
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المدرس؟')) {
      this.enseignantService.deleteEnseignant(enseignantId).subscribe({
        next: () => {
          this.fetchAllEnseignants();
        },
        error: (error) => {
          console.error('Error deleting enseignant', error);
        }
      });
    }
  }
  

  editEnseignant(enseignant: Enseignant): void {
    this.enseignantForm.patchValue({
      nom: enseignant.nom,
      prenom: enseignant.prenom,
      numerotel: enseignant.numerotel,
      classe: enseignant.classe,
    });
    this.showForm = true;
    this.selectedEnseignantId = enseignant.id;
  }

  filterEnseignants(): void {
    this.filteredEnseignants = this.enseignants.filter(enseignant => 
      enseignant.nom.toLowerCase().includes(this.searchName.toLowerCase()) &&
      enseignant.classe.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule ,Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule and FormBuilder
import { EleveService } from '../../services/eleve.service';
import { Eleve } from '../../models/eleve.model';
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
  selector: 'app-gestioneleve',
  standalone: true,
  imports: [
    ColComponent,
    FormsModule ,
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
    ReactiveFormsModule // Include ReactiveFormsModule in the imports
  ],
  templateUrl: './gestioneleve.component.html',
  styleUrls: ['./gestioneleve.component.scss']
})
export class GestioneleveComponent implements OnInit {
  selectedEleveId: number | null = null; // Declare selectedEleveId

  eleves: Eleve[] = [];
  eleveForm!: FormGroup;  // Declare the eleveForm
  showForm = false;       // Declare and initialize showForm
  isSubmitting = false;   // Declare and initialize isSubmitting
  searchName: string = '';
searchClass: string = '';
filteredEleves: Eleve[] = [];
  constructor(private eleveService: EleveService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchAllEleves();
    this.initEleveForm(); // Initialize the form
  }

  fetchAllEleves(): void {
    this.eleveService.getAllEleves().subscribe({
      next: (data) => {
        this.eleves = data;
        this.filteredEleves = data; // Initialize filteredEleves with all Eleves
      },
      error: (error) => {
        console.error('Error fetching Eleves', error);
      }
    });
  }
  

  initEleveForm(): void {
    // Initialize the form with form controls and validators
    this.eleveForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      classe: ['', [Validators.required]],
      niveau: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.eleveForm.valid) {
      this.isSubmitting = true;
      const eleveData = this.eleveForm.value;
  
      if (this.selectedEleveId) {
        // If an Eleve is selected for editing, update it
        this.eleveService.updateEleve(this.selectedEleveId, eleveData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEleves(); // Refresh the list after updating
            this.selectedEleveId = null; // Reset the selected Eleve ID
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating Eleve', error);
          }
        });
      } else {
        // Otherwise, create a new Eleve
        this.eleveService.addEleve(eleveData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEleves(); // Refresh the list after adding
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding Eleve', error);
          }
        });
      }
    }
  }
  
  deleteEleve(eleveId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطالب؟')) { // Optional: confirm before deleting
      this.eleveService.deleteEleve(eleveId).subscribe({
        next: () => {
          this.fetchAllEleves(); // Refresh the list after deleting
        },
        error: (error) => {
          console.error('Error deleting Eleve', error);
        }
      });
    }
  }
  editEleve(eleve: Eleve): void {
    this.eleveForm.patchValue({
      nom: eleve.nom,
      prenom: eleve.prenom,
      classe: eleve.classe,
      niveau: eleve.niveau,
    });
    this.showForm = true; // Show the form for editing
    this.selectedEleveId = eleve.id; // Store the ID of the selected Eleve for updating
  }
  filterEleves(): void {
    this.filteredEleves = this.eleves.filter(eleve => 
      eleve.nom.toLowerCase().includes(this.searchName.toLowerCase()) &&
      eleve.classe.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }
  
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnseignantService } from '../../services/enseignant.service'; // New service for enseignants
import { Enseignant } from '../../models/enseignant.model'; // Update to Enseignant model
import { CommonModule } from '@angular/common';
import { Class } from '../../models/class.model'; // Import Class model
import { ClassService } from '../../services/class.service'; // Import the ClassService
import { EnseignantClassesService } from '../../services/enseignantClasses.service'; // Import the ClassService
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule and TranslateService


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
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './gestionenseignant.component.html',
  styleUrls: ['./gestionenseignant.component.scss']
})
export class GestionenseignantComponent implements OnInit {
  selectedEnseignantId: number | null | undefined = null;
  enseignants: Enseignant[] = [];
  classes: Class[] = []; // Store classes
  levelData = { niveau: '', classe: '', matiere: '', name: '' };

  enseignantForm!: FormGroup;
  showForm = false;
  isSubmitting = false;
  searchName: string = '';
  searchClass: string = '';
  filteredEnseignants: Enseignant[] = [];
  filteredClasses: any[] = [];
  newEntryExist = false;

  storedData: Array<{ niveau: string, classe: string, matiere: string, name: string }> = [];

  constructor(
    private enseignantService: EnseignantService,
    private classService: ClassService, // Inject ClassService
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private enseignantClassesService: EnseignantClassesService
  ) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }

  ngOnInit(): void {
    this.fetchAllEnseignants();
    this.initEnseignantForm();
  }


  onAddClick(): void {
    const formValue = this.enseignantForm.getRawValue();
    const selectedClass = this.classes.find(c => c.id === formValue.classe);

    const newEntry = {
      niveau: formValue.niveau,
      classe: formValue.classe,
      matiere: formValue.matiere,
      name: selectedClass ? selectedClass.nomDeClasse : ''
    };

    const entryExists = this.storedData.some(entry =>
      entry.niveau === newEntry.niveau &&
      entry.classe === newEntry.classe
      //&& entry.matiere === newEntry.matiere
    );

    if (entryExists) {
      console.log('Entry already exists. Skipping addition.');
      this.newEntryExist = true;
      setTimeout(() => {
        this.newEntryExist = false;
      }, 2000);
      return;
    }

    this.storedData.push(newEntry);

    console.log('Added new entry:', newEntry);
    console.log('Updated storedData:', this.storedData);

    // Reset only level, class, and subject fields
    this.enseignantForm.patchValue({
      niveau: '',
      classe: '',
      matiere: ''
    });
    this.enseignantForm.get('classe')?.disable();
    this.enseignantForm.get('matiere')?.disable();

    this.classes = [];
    this.cdr.detectChanges();
  }

  // Function to delete a row from the table
  onDeleteClick(index: number) {
    this.storedData.splice(index, 1);
  }

  onClasseChange(): void {
    this.enseignantForm.patchValue({ matiere: '' });
    this.enseignantForm.get('matiere')?.enable();
  }

  onLevelChange(): void {
    const niveau = this.enseignantForm.get('niveau')?.value;

    // Reset classes array
    this.classes = [];

    // Reset and disable classe and matiere fields
    this.enseignantForm.patchValue({
      classe: '',
      matiere: ''
    });
    this.enseignantForm.get('classe')?.disable();
    this.enseignantForm.get('matiere')?.disable();

    if (niveau) {
      this.classService.getClassesByNiveau(niveau).subscribe({
        next: (data) => {
          this.classes = data.classes;
          this.enseignantForm.get('classe')?.enable();
        },
        error: (error) => {
          console.error('Error fetching classes', error);
        }
      });
    }
  }

  fetchAllEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe({
      next: (data) => {
        this.enseignants = data; // Store the fetched enseignants
        this.filteredEnseignants = data; // If you have a filter mechanism
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
      niveau: [''],
      classe: [''],
      matiere: [''],
    });

    // Disable classe and matiere fields initially
    this.enseignantForm.get('classe')?.disable();
    this.enseignantForm.get('matiere')?.disable();
  }

  onSubmit(): void {
    Object.keys(this.enseignantForm.controls).forEach(key => {
      const control = this.enseignantForm.get(key);
      console.log(`${key} valid:`, control?.valid, 'value:', control?.value);
    });

    console.log(this.enseignantForm.valid);

    if (this.enseignantForm.valid) {
      this.isSubmitting = true;
      const enseignantData = this.enseignantForm.value;

      // Convert the classe string to an array if necessary
      enseignantData.classes = this.storedData.map(data => ({
        classeId: data.classe, // Assuming storedData contains the class IDs
        matiere: data.matiere    // Assuming storedData contains the subjects (matiere)
      }));

      if (this.selectedEnseignantId) {
        console.log("Updating...");

        // Update existing enseignant
        this.enseignantService.updateEnseignant(this.selectedEnseignantId, enseignantData).subscribe({
          next: () => {

            this.enseignantClassesService.updateEnseignantClasses(String(this.selectedEnseignantId), enseignantData).subscribe({
              next: () => {
                console.log('Successfully updated EnseignantClasses');
                this.isSubmitting = false;
                this.showForm = false;
                this.fetchAllEnseignants();
                this.selectedEnseignantId = null;
              },
              error: (error) => {
                console.error('Error updating EnseignantClasses', error);
              }
            });
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating enseignant', error);
          }
        });
      } else {
        console.log("Creating...");
        // Add a new enseignant
        this.enseignantService.addEnseignant(enseignantData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.showForm = false;
            this.selectedEnseignantId = null;
            this.fetchAllEnseignants();

            console.log("Full Response:", response.enseignant.id, enseignantData.classes);

            this.createEnseignantClasseRelations(String(response.enseignant.id), enseignantData.classes);
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding enseignant', error);
          }
        });
      }
    }
  }

  createEnseignantClasseRelations(enseignantId: string, classes: Array<{ classe: string, matiere: string }>): void {
    this.enseignantClassesService.addEnseignantClasses(enseignantId, classes).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showForm = false;
        this.fetchAllEnseignants();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating enseignantClasse relations', error);
      }
    });
  }

  cancelSubmitting() {
    this.showForm = false
    this.selectedEnseignantId = null;
    this.storedData.splice(0, this.storedData.length);

    this.enseignantForm.patchValue({
      nom: '',
      prenom: '',
      numerotel: '',
      niveau: '',
      classe: '',
      matiere: ''
    });
    this.enseignantForm.get('classe')?.disable();
    this.enseignantForm.get('matiere')?.disable();

    this.classes = [];
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
      // Assuming we need to set the classe field based on storedData
      classe: enseignant.classes.map(c => c.id)
    });

    this.showForm = true;
    this.selectedEnseignantId = enseignant.id; // Store the selected enseignant ID

    this.storedData = enseignant.classes.map(classe => ({
      niveau: classe.niveau,
      classe: classe.id,
      matiere: classe.EnseignantClasse.matiere,
      name: classe.nomDeClasse
    }));
  }

  filterEnseignants(): void {
    this.filteredEnseignants = this.enseignants.filter(enseignant =>
      enseignant.nom.toLowerCase().includes(this.searchName.toLowerCase())

    );
  }
  filterEnseignantsByClasse(): void {
    this.filteredEnseignants = this.enseignants.filter(enseignant =>

      enseignant.classe.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }
}

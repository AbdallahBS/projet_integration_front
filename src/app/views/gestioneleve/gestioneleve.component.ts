import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule and FormBuilder
import { EleveService } from '../../services/eleve.service';
import { ClassService } from 'src/app/services/class.service';
import { Eleve } from '../../models/eleve.model';
import { Class } from '../../models/class.model';
import { CommonModule } from '@angular/common';
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
  selector: 'app-gestioneleve',
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
    TranslateModule // Include ReactiveFormsModule in the imports
  ],
  templateUrl: './gestioneleve.component.html',
  styleUrls: ['./gestioneleve.component.scss']
})
export class GestioneleveComponent implements OnInit {
  selectedEleveId: number | null = null;  // Change the type to string | null
  classes: Class[] = []; // Store classes

  eleves: Eleve[] = [];
  eleveForm!: FormGroup;  // Declare the eleveForm
  showForm = false;       // Declare and initialize showForm
  isSubmitting = false;   // Declare and initialize isSubmitting
  searchName: string = '';
  searchClass: string = '';
  filteredEleves: Eleve[] = [];
  newEntryExist = false;

  constructor(
    private eleveService: EleveService,
    private classService: ClassService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    translate.setDefaultLang('ar');
    translate.use('ar');
  }

  ngOnInit(): void {
    this.fetchAllEleves();
    this.initEleveForm();
    this.fetchAllClasses();
  }

  fetchAllClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (data) => {
        this.classes = data.classes; // Store all classes initially
      },
      error: (error) => {
        console.error('Error fetching all classes', error);
      }
    });
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
    // Initialize the form and disable 'classe' select initially
    this.eleveForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      classe: [{ value: '', disabled: true }, [Validators.required]],  // Disable 'classe'
      niveau: ['', [Validators.required]],
    });

    this.eleveForm.get('classe')?.disable();
  }

  onLevelChange() {
    const niveau = this.eleveForm.get('niveau')?.value;

    // Reset classes array
    this.classes = [];

    // Reset and disable classe and matiere fields
    this.eleveForm.patchValue({
      classe: '',
    });

    if (niveau) {
      this.classService.getClassesByNiveau(niveau).subscribe({
        next: (data) => {
          this.classes = data.classes;
          this.eleveForm.get('classe')?.enable();
        },
        error: (error) => {
          console.error('Error fetching classes', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eleveForm.valid) {
      this.isSubmitting = true;
      /**      const eleveData = {
              ...this.eleveForm.value,
              classeId: this.getSelectedClasseId(this.eleveForm.value.classe)  // Adjust to get the correct class ID
            };
             
            if (this.selectedEleveId) {
              this.eleveService.updateEleve(this.selectedEleveId, eleveData).subscribe({**/
      const eleveData = this.eleveForm.value;

      if (this.selectedEleveId) {
        // If an Eleve is selected for editing, update it
        const eleve = { nom: eleveData.nom, prenom: eleveData.prenom, classeId: eleveData.classe };
        this.eleveService.updateEleve(this.selectedEleveId, eleve).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEleves();
            this.selectedEleveId = null;
            this.resetForm();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating Eleve', error);
          }
        });
      } else {

        //this.eleveService.addEleve(eleveData).subscribe({
        // Otherwise, create a new Eleve
        const eleve = { nom: eleveData.nom, prenom: eleveData.prenom, classeId: eleveData.classe };
        this.eleveService.addEleve(eleve).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllEleves();
          },
          error: (error) => {
            this.isSubmitting = false;
            if (error.status === 409) {
              console.log("hehehehehe");

              // If conflict status is returned, display an error message
              this.newEntryExist = true;
              setTimeout(() => {
                this.newEntryExist = false;
              }, 3000);
            } else {
              console.error('Error adding Eleve', error);
            }
          }
        });
      }
    }
  }

  /**getSelectedClasseId(classeName: string): string {
    const foundClasse = this.eleves.find(eleve => eleve.classe.nomDeClasse === classeName);
    return foundClasse ? foundClasse.classe.id : '';
  }
  
  
  deleteEleve(eleveId: string): void {**/

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
    this.eleveForm.get('classe')?.enable();

    this.classes = []

    const relatedClass: Class = {
      id: eleve.classe.id,
      nomDeClasse: eleve.classe.nomDeClasse,
      niveau: eleve.classe.niveau,
      createdAt: eleve.classe.createdAt,
      updatedAt: eleve.classe.updatedAt,
      studentCount: 0, // Default value or fetch it if necessary
      enseignants: [], // Default empty array or fetch it if necessary
      students: [],    // Default empty array or fetch it if necessary
    };

    this.classes.push(relatedClass);

    this.eleveForm.patchValue({
      nom: eleve.nom,
      prenom: eleve.prenom,
      /**classe: eleve.classe.nomDeClasse,  // Use classe.nomDeClasse
      niveau: eleve.classe.niveau        // Use classe.niveau
    });
    this.showForm = true;
    this.selectedEleveId = eleve.id;**/
      niveau: eleve.classe.niveau,

      classe: eleve.classe.id,
    });

    this.showForm = true; // Show the form for editing
    this.selectedEleveId = eleve.id; // Store the ID of the selected Eleve for updating
  }

  filterEleves(): void {
    /**this.filteredEleves = this.eleves.filter(eleve => 
      eleve.nom.toLowerCase().includes(this.searchName.toLowerCase()) &&
      eleve.classe.nomDeClasse.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }


  onLevelChange(): void {
    const niveau = this.eleveForm.get('niveau')?.value;
    console.log(niveau);
    this.classes = [];
    this.eleveForm.get('classe')?.disable();

    if (niveau) {
      this.classService.getClassesByNiveau(niveau).subscribe({
        next: (data) => {
          this.classes = data.classes;
          console.log(this.classes);
          
          this.eleveForm.get('classe')?.enable();
        },
        error: (error) => {
          console.error('Error fetching classes', error);
        }
      });
    }

  }
  
  onClasseChange(): void {
  
  }**/
    this.filteredEleves = this.eleves.filter(eleve =>
      eleve.nom.toLowerCase().includes(this.searchName.toLowerCase())
      //&& eleve.classe.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }

  resetForm(): void {
    this.eleveForm.get('classe')?.disable();
    this.eleveForm.reset(); // Reset the form
    this.showForm = false;  // Hide the form
    this.selectedEleveId = null; // Optionally clear the selectedEleveId if needed
    this.classes = []; // Clear the classes array if needed
  }
}

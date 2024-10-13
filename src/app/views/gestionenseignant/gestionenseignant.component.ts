import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnseignantService } from '../../services/enseignant.service'; // New service for enseignants
import { Enseignant } from '../../models/enseignant.model'; // Update to Enseignant model
import { CommonModule } from '@angular/common';
import { Class } from '../../models/class.model'; // Import Class model
import { ClassService } from '../../services/class.service'; // Import the ClassService

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
  classes: Class[] = []; // Store classes
  levelData = { niveau: '', classe: '' ,matiere :'' , name:''};

  enseignantForm!: FormGroup;
  showForm = false;
  isSubmitting = false;
  searchName: string = '';
  searchClass: string = '';
  filteredEnseignants: Enseignant[] = [];

  storedData: Array<{ niveau: string, classe: string, matiere: string , name : string }> = [];

  constructor(
    private enseignantService: EnseignantService,
    private classService: ClassService, // Inject ClassService
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchAllEnseignants();
   // this.fetchAllClasses(); // Fetch classes on initialization

    this.initEnseignantForm();
  }


  onAddClick() {
 
    console.log(this.levelData);
    
    if (this.levelData.niveau && this.levelData.classe && this.levelData.matiere && this.levelData.name) {
      // Push a copy of the current levelData into storedData
      this.storedData.push({ ...this.levelData });
      
      // Clear the form
  
    }
  }

  // Function to delete a row from the table
  onDeleteClick(index: number) {
    this.storedData.splice(index, 1);
  }

  onClasseChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = selectElement.selectedIndex;
    const selectedText = selectElement.options[selectedIndex].text; // Get the text content of the selected option

    console.log(selectedText);
    
    this.levelData.classe=selectedValue
    this.levelData.name=selectedText

  
  }

    onMatiereChange(event: Event) {
      const selectedValue = (event.target as HTMLSelectElement).value;
   
      
      this.levelData.matiere=selectedValue
    }

  onLevelChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
 
    
    this.levelData.niveau=selectedValue
    console.log(this.levelData.niveau);
    if (this.levelData.niveau) {
    
      
      this.classService.getClassesByNiveau(this.levelData.niveau).subscribe({
        next: (data) => {
          this.classes = data.classes;
          console.log(this.classes);
           // Store the classes in the component
        },
        error: (error) => {
          console.error('Error fetching classes', error);
        }
      });
    }
      
    
  }




  fetchAllClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (data) => {
        this.classes = data.classes; // Store the classes in the component
      },
      error: (error) => {
        console.error('Error fetching classes', error);
      }
    });
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
  
      // Convert the classe string to an array if necessary
      enseignantData.classe = enseignantData.classe.split(',').map((classe: string) => classe.trim());
  
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
      enseignant.nom.toLowerCase().includes(this.searchName.toLowerCase()) 
      
    );
  }
  filterEnseignantsByClasse(): void {
    this.filteredEnseignants = this.enseignants.filter(enseignant => 

      enseignant.classe.toLowerCase().includes(this.searchClass.toLowerCase())
    );
  }
}

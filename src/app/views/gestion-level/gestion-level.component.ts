import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { Class } from '../../models/class.model';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  CardTitleDirective,
  CardTextDirective,
  CardSubtitleDirective,
  CardFooterComponent,
  ColComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-level',
  standalone: true,
  imports: [
    ColComponent,
    FormsModule,
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    CardSubtitleDirective,
    CardFooterComponent,
  ],
  templateUrl: './gestion-level.component.html',
  styleUrls: ['./gestion-level.component.scss'],
})
export class LevelComponent implements OnInit {
  selectedClassId: string | null = null;
  
  selectedClassName: string = ''; // For class name filter
  selectedLevel: string = ''; // 
  classes: Class[] = [];
  showForm = false;
  isSubmitting = false;
  searchName: string = '';
  showEnseignants: boolean = false; // To control the display of enseignants

  showStudents = false;
  filteredClasses: Class[] = [];
  expandedRow: string | null = null;  // Track the expanded row (by class ID)

  classData: Class = {
    id: '',
    nomDeClasse: '',
    niveau: '',
    studentCount: 0, // Default value is 0
    enseignants: [],
    students: [],


  };

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.fetchAllClasses();
  }

  fetchAllClasses(): void {
    this.classService.getAllClassesDetails().subscribe({
      next: (data) => {
        this.classes = data.classes;
        console.log(this.classes);
        
        
        this.filteredClasses = data.classes;
        
        // For filtering
      },
      error: (error) => {
        console.error('Error fetching Classes', error);
      },
    });
  }



  viewEnseignants(classId: string) {
    this.selectedClassId = classId;
    this.showEnseignants = true;
    this.showStudents = false; // Ensure students view is hidden
  }

  viewStudents(classId: string) {
    this.selectedClassId = classId;
    this.showStudents = true;
    this.showEnseignants = false; // Ensure enseignants view is hidden
  }

  backToClasses() {
    this.showEnseignants = false;
    this.showStudents = false;
    this.selectedClassId = null; // Reset the selected class
  }


  filterClasses(): void {
    this.filteredClasses = this.classes.filter((cls) => {
      // Filter by class name, level, and search term
      const matchesName = this.selectedClassName ? cls.nomDeClasse === this.selectedClassName : true;
      const matchesLevel = this.selectedLevel ? cls.niveau === this.selectedLevel : true;
      const matchesSearch = cls.nomDeClasse.toLowerCase().includes(this.searchName.toLowerCase());

      return matchesName && matchesLevel && matchesSearch;
    });
  }




  expandedClasses: { [key: string]: boolean } = {}; // Use string as key type

  toggleRowExpansion(classId: string): void {
    this.expandedClasses[classId] = !this.expandedClasses[classId]; // Toggle the expansion state
  }
  editClass(cls: Class): void {
    this.selectedClassId = cls.id; // Set the selected class ID for editing
    this.classData = { ...cls }; // Pre-fill the form with the class data
    this.showForm = true; // Show the form for editing
  }
  onSubmit(): void {
    if (this.classData.nomDeClasse && this.classData.niveau) {
      this.isSubmitting = true;
  
      if (this.selectedClassId) {
        // Update existing class
        this.classService.updateClass(this.selectedClassId, this.classData).subscribe({
          next: (response) => {
            alert('Class updated successfully');
            this.fetchAllClasses(); // Refresh the list
            this.resetForm(); // Reset form after submission
          },
          error: (error) => {
            console.error('Error updating class:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
      } else {
        // Add new class
        this.classService.addClass(this.classData).subscribe({
          next: (response) => {
            alert('Class added successfully');
            this.fetchAllClasses(); // Refresh the list
            this.resetForm(); // Reset form after submission
          },
          error: (error) => {
            console.error('Error adding class:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
      }
    }
  }
  deleteClasse(id: string): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.classService.deleteClass(id).subscribe({
        next: (response) => {
          alert('Class deleted successfully');
          this.fetchAllClasses(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error('Error deleting class:', error);
        },
      });
    }
  }





  resetForm(): void {
    this.classData = {
      id: '',
      nomDeClasse: '',
      niveau: '',
      studentCount: 0,
      enseignants: [],
      students : [],
    };
    this.showForm = false;
  }
}

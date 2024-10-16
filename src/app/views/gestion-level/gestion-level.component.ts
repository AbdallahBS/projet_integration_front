import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { Class } from '../../models/class.model';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule and TranslateService
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
    TranslateModule,
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
  newEntryExist = false;
  className : string ="";
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

  constructor(private classService: ClassService
    ,    private translate: TranslateService,

  ) {

    translate.setDefaultLang('ar');
    translate.use('ar');
    
  }

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
    this.classService.getStudentsByClassId(classId).subscribe({
      next: (data) => {
        console.log(data);
        this.classData.students = data; 
        if (data.length > 0) {
          this.classData.nomDeClasse = data[0].classe.nomDeClasse; // Store the class name
          this.classData.niveau = data[0].classe.niveau; // Store the class level if needed
          this.classData.studentCount = data.length; // Update student count based on the retrieved data
        }
        console.log(
         "a", this.classData.students
        );
        
      },
      error: (error) => {
        console.error('Error fetching students for class', error);
      },
    }); // Ensure enseignants view is hidden
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
            if (error.status === 409) {
              this.newEntryExist = true;
              setTimeout(() => {
                this.newEntryExist = false;
              }, 3000); // Show alert if the class already exists
            } else {
              console.error('Error creating class', error);
            }
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
      }
    }
  }

  printStudents(): void {
    const printContent = document.getElementById('studentsTable')?.innerHTML;
    const currentDate = new Date().toLocaleDateString('ar-TN'); // Get the current date in Arabic format
    const schoolName = 'المدرسة الإعدادية بقليبية'; // School name

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow?.document.write(`
        <html>
            <head>
                <title>طباعة قائمة التلاميذ</title>
                <style>
                    /* Add your styles here */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                    }
                    h2 {
                        text-align: center;
                        margin-top: 10px;
                    }
                    p {
                        text-align: center;
                        font-size: 12px;
                        margin: 5px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>${schoolName}</h1>
                <h2>قائمة التلاميذ</h2>
                <p>حرر بي: ${currentDate}</p>
                <h3>قسم: ${this.classData.nomDeClasse}</h3>
                <table>${printContent}</table>
            </body>
        </html>
    `);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
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

  exportToPDF(): void {
    const data = document.getElementById('studentsTable');
    if (data) {
        html2canvas(data).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('قائمة_التلاميذ.pdf');
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

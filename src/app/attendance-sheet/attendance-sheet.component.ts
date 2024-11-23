import { Component , OnInit ,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { CommonModule } from '@angular/common';
import { EtudeService } from '../services/etude.service';  // Import the EtudeService
import { EleveService , Student  } from '../services/eleve.service';
interface StudentFormatted {
  id: string; // Add this property
  name: string;
  sessions: string[];
  amount: number;
  notes: string;
}
interface FilteredStudent {
  id: string;
  name: string;
}

@Component({
  selector: 'app-attendance-sheet',
  standalone: true, // Ensure standalone is set to true
  imports: [CommonModule,FormsModule,], // Add CommonModule here
  templateUrl: './attendance-sheet.component.html',
  styleUrls: ['./attendance-sheet.component.scss']
})

export class AttendanceSheetComponent implements OnInit{


  totalAmount = 300;
  etudes: any[] = [];
  filteredStudents: StudentFormatted[] = [];
  isPrinting = false;  // Flag to check if the page is being printed
  allStudents: StudentFormatted[] = []; // All students fetched by niveau
  students: StudentFormatted[] = [];
  Allstudents: StudentFormatted[] = [];
  addingStudent: boolean = false; // Toggle for the add student row
  selectedEtude: any = null;  // To store the selected etude
  newStudentName: string = ''; // To hold the name of the new student


  constructor(private etudeService: EtudeService , private studentService: EleveService) {}


  ngOnInit(): void {

    this.fetchEtudes();  // Fetch etudes data on component initialization
  }
// Method to fetch etudes from the service
fetchEtudes(): void {
  this.etudeService.getEtudes().subscribe(
    (data) => {
      console.log('Etudes data:', data);
      this.etudes = data; // Store the fetched data in the 'etudes' property
    },
    (error) => {
      console.error('Error fetching etudes:', error);
    }
  );
}
printPage() {
  this.isPrinting = true; 
  const printContents = document.querySelector('.attendance-sheet')?.innerHTML;
  const originalContents = document.body.innerHTML;
  
  // Replace the body content with the selected content
  document.body.innerHTML = printContents!;
  
  // Trigger the print dialog
  window.print();
  
  // Restore the original content after printing
  document.body.innerHTML = originalContents;
  this.isPrinting = false; 
}
onSelectEtude(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;  // Cast event.target to HTMLSelectElement
  const selectedEtudeId = selectElement.value;  // Now you can safely access 'value'
  
  // Find the selected etude from the etudes array using the selectedEtudeId
  this.selectedEtude = this.etudes.find(etude => etude.id === selectedEtudeId);

  if (this.selectedEtude) {
    this.fetchStudentsByLevel('7');
  }

  this.etudeService.getElevesFromEtude(selectedEtudeId).subscribe(
    (data) => {
      console.log("check this ", data);

      if (data.eleves && data.eleves.length > 0) {
        console.log("hmmmm");
        
        // If Eleves are enrolled, display them
        this.students = data.eleves.map((student: Student) => {
          // Prepare the student object
          const studentFormatted = {
            id: student.id,
            name: `${student.nom} ${student.prenom}`,
            sessions: student.attendances.map(
              (attendance: any) => attendance.status
            ), // Map attendance status to sessions
            amount: 0, // Initialize amount to 0
            notes: '' // Empty notes
          };

          // Update the amount based on the student's sessions
          this.updateStudentAmount(studentFormatted);
          
          // Return the student object
          return studentFormatted;
        });
        this.updateTotalAmount()
        console.log(this.students, 'etude');
        
      } else {
        console.log("problem here ");
        
        // If no Eleves are enrolled, fetch students by level (niveau = 7)
        this.fetchAndSaveStudentsByLevel(selectedEtudeId, '7');
      }
    },
    (error) => {
      console.error('Error fetching Eleves from Etude:', error);
      this.fetchAndSaveStudentsByLevel(selectedEtudeId, '7');    
    }
  );
  // Optionally, handle any additional logic after selection
}


currentDate = new Date();





fetchAndSaveStudentsByLevel(etudeId: string, niveau: string): void {
  this.studentService.getStudentsByNiveau(niveau).subscribe(
    (data) => {
      const eleveIds = data.map((student: Student) => student.id); // Extract student IDs
      const studentsFormatted = data.map((student: Student) => ({
        id: student.id,
        name: `${student.nom} ${student.prenom}`,
        sessions: Array(4).fill('+'),
        amount: 35,
        notes: '',
      }));

      // Save these students to the Etude
      this.etudeService.addElevesToEtude(etudeId, eleveIds).subscribe(
        () => {
          console.log('Students added to Etude successfully.');
          this.students = studentsFormatted; // Update UI
          this.saveDefaultAttendance(etudeId, eleveIds); // Save default attendance
        },
        (error) => {
          console.error('Error adding students to Etude:', error);
        }
      );
    },
    (error) => {
      console.error('Error fetching students by level:', error);
      this.students = []; // Clear students on error
    }
  );
}


saveDefaultAttendance(etudeId: string, eleveIds: string[]): void {
  // Ensure there are seances in the selectedEtude
  if (!this.selectedEtude?.seances || this.selectedEtude.seances.length === 0) {
    console.error('No seances available for attendance.');
    return;
  }

  const seances = this.selectedEtude.seances; // Get all seances
  let currentIndex = 0; // Start with the first seance

  const processNextSeance = () => {
    if (currentIndex >= seances.length) {
      console.log('Default attendance saved for all seances.');
      return; // Stop processing once all seances are done
    }

    const seance = seances[currentIndex];
    const attendanceArray = eleveIds.map((eleveId) => ({
      eleveId,
      attendanceStatus: 'present', // Default to present
    }));

    const attendanceData = { attendance: attendanceArray };

    // Save attendance for the current seance
    this.etudeService.markAttendance(etudeId, seance.id, attendanceData).subscribe(
      (response) => {
        console.log(`Attendance saved for seance ID ${seance.id}:`, response);
        currentIndex++; // Move to the next seance
        processNextSeance(); // Process the next seance
      },
      (error) => {
        console.error(`Error saving attendance for seance ID ${seance.id}:`, error);
        currentIndex++; // Move to the next seance even if an error occurs
        processNextSeance(); // Process the next seance
      }
    );
  };

  // Start processing the first seance
  processNextSeance();
}

  splitSessions(sessions: string[], chunkSize: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < sessions.length; i += chunkSize) {
      result.push(sessions.slice(i, i + chunkSize));
    }
    return result;
  }

  getSessionDate(index: number): string {
    return this.selectedEtude?.seances[index]?.formattedDate || '';
  }

  toggleAttendance(studentIndex: number, sessionIndex: number) {
    const student = this.students[studentIndex];
    const session = student.sessions[sessionIndex];
    
    const etudeId = this.selectedEtude?.id; // Assuming selectedEtude has the ID
    const seanceId = this.selectedEtude?.seances[sessionIndex]?.id; // Get the seance ID from the selectedEtude
  console.log(etudeId,seanceId);
  
    if (!etudeId || !seanceId) {
      console.error('Etude ID or Seance ID is missing.');
      return;
    }
    let attendanceStatus: string;
    // Toggle attendance status: 'present' (green), 'absent' (red), 'absentwithreason' (yellow)
    if (session === '+') {
      attendanceStatus = 'absentwithreason';
      student.sessions[sessionIndex] = 'absentwithreason';  // Mark as absent with reason
    } else if (session === 'absentwithreason') {
      attendanceStatus = 'absent';
      student.sessions[sessionIndex] = 'absent';  // Mark as absent
    } else {
      attendanceStatus = 'present';
      student.sessions[sessionIndex] = '+';  // Reset to present
    }
    const attendanceData = {
      attendance: [
        {
          eleveId: student.id, // Assuming `students` contains `id` for each student
          attendanceStatus,
        },
      ],
    };

    this.etudeService.markAttendance(etudeId, seanceId, attendanceData).subscribe(
      (response) => {
        console.log('Attendance updated successfully:', response);
        this.updateStudentAmount(student); // Recalculate the amount locally
      },
      (error) => {
        console.error('Error updating attendance:', error);
      }
    );

    // Recalculate the amount for this student based on session states
    this.updateStudentAmount(student);
  }

  updateStudentAmount(student: StudentFormatted) {
    let totalAmountForStudent = 0;

    student.sessions.forEach((session) => {
      if (session === 'absentwithreason') {
        totalAmountForStudent += 8.75 * 0.85;  // Apply 15% reduction for absent
      } else {
        totalAmountForStudent += 8.75;  // Full amount for present or absent with reason
      }
      
    });

    student.amount = totalAmountForStudent;
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    this.totalAmount = this.students.reduce((total, student) => total + student.amount, 0);
  }

  deleteStudent(index: number): void {
    if (confirm('هل تريد حذف هذا الطالب؟')) {
      const studentId = this.students[index].id; // Get the ID of the student to be deleted
      const etudeId = this.selectedEtude?.id; // Ensure the etude ID is available
  
      if (!etudeId) {
        console.error('Etude ID is missing.');
        return;
      }
  
      // Call the delete API
      this.etudeService.removeStudentFromEtude(etudeId, studentId).subscribe(
        (response) => {
          console.log('Student deleted successfully:', response);
  
          // Remove the student from the local list
          this.students.splice(index, 1);
          this.updateTotalAmount(); // Update the total amount after deletion
        },
        (error) => {
          console.error('Error deleting student:', error);
          alert('حدث خطأ أثناء حذف الطالب.');
        }
      );
    }
  }
  startAddStudent(): void {
    this.addingStudent = true; // Show input field
    this.newStudentName = ''; // Clear the input
  }



  fetchStudentsByLevel(niveau: string): void {
    this.studentService.getStudentsByNiveau(niveau).subscribe(
      (data) => {
        // Store the full list of students globally
        this.Allstudents = data.map((student) => ({
          id: student.id,
          name: `${student.nom} ${student.prenom}`,
          sessions: Array(4).fill('+'), // Default session data
          amount: 35, // Static amount
          notes: '', // Empty notes
        }));
        console.log('All students:', this.Allstudents);
        
      },
      (error) => {
        console.error('Error fetching students by level:', error);

        this.Allstudents = []; // Clear filtered list on error
      }
    );
  }
  
  
  filterStudentSuggestions(): void {
    if (this.newStudentName) {
      this.filteredStudents = this.Allstudents.filter(student =>
        student.name.toLowerCase().includes(this.newStudentName.toLowerCase())
      );
    } else {
      this.filteredStudents = [];
    }
  }
  
  selectStudent(student: StudentFormatted): void {
    this.newStudentName = student.name; // Set the selected student's name in the input
    this.filteredStudents = []; // Clear suggestions
  }
  

  confirmAddStudent(): void {
    if (this.newStudentName.trim()) {
      // Find the selected student in the Allstudents array
      const selectedStudent = this.Allstudents.find(student =>
        student.name.toLowerCase() === this.newStudentName.toLowerCase()
      );
  
      if (selectedStudent) {
        // Check if the student already exists in the students array (by id)
        const studentExists = this.students.some(student => student.id === selectedStudent.id);
  
        if (studentExists) {
          // If the student already exists, show an alert in Arabic
          alert('الطالب موجود بالفعل في الجدول!');
          return; // Exit the function if the student already exists
        }
  
        // Prepare the list of student IDs (just one ID in this case)
        const eleveIds = [selectedStudent.id];
  
        // Add the student to the database using the existing ID
        this.etudeService.addElevesToEtude(this.selectedEtude.id, eleveIds).subscribe(
          () => {
            console.log('Student added to Etude successfully.');
  
            // Add the student to the students list
            this.students.push({
              id: selectedStudent.id,
              name: selectedStudent.name,
              sessions: selectedStudent.sessions,
              amount: selectedStudent.amount,
              notes: selectedStudent.notes
            });
  
            // Clear suggestions and reset the input field
            this.filteredStudents = [];
            this.addingStudent = false;
            this.newStudentName = ''; 
          },
          (error) => {
            console.error('Error adding student to Etude:', error);
          }
        );
      }
    } else {
      alert('يرجى إدخال اسم الطالب!');
    }
  }
  

  cancelAddStudent(): void {
    this.newStudentName = '';
    this.addingStudent = false; // Cancel adding student
  }

 
}


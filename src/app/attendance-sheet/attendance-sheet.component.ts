import { Component , OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtudeService } from '../services/etude.service';  // Import the EtudeService
import { EleveService , Student  } from '../services/eleve.service';
interface StudentFormatted {
  name: string;
  sessions: string[];
  amount: number;
  notes: string;
}
@Component({
  selector: 'app-attendance-sheet',
  standalone: true, // Ensure standalone is set to true
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './attendance-sheet.component.html',
  styleUrls: ['./attendance-sheet.component.scss']
})
export class AttendanceSheetComponent implements OnInit{


  totalAmount = 300;
  etudes: any[] = [];
  students: StudentFormatted[] = [];

  selectedEtude: any = null;  // To store the selected etude


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

onSelectEtude(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;  // Cast event.target to HTMLSelectElement
  const selectedEtudeId = selectElement.value;  // Now you can safely access 'value'
  
  // Find the selected etude from the etudes array using the selectedEtudeId
  this.selectedEtude = this.etudes.find(etude => etude.id === selectedEtudeId);
  this.studentService.getStudentsByNiveau('7').subscribe(
    (data) => {
      // Transform API data into the required format
      this.students = data.map((student) => ({
        name: `${student.nom} ${student.prenom}`, // Combine `nom` and `prenom` for the name
        sessions: ['+', '+', '+', '+'], // Static sessions data
        amount: 35, // Static amount
        notes: '', // Empty notes initially
      }));
    },
    (error) => {
      console.error('Error fetching students:', error);
      this.students = []; // Clear students on error
    }
  );
  // Optionally, handle any additional logic after selection
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
}


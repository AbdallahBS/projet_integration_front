import { Component , OnInit ,NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EtudeService } from '../services/etude.service';
import { EleveService , Student  } from '../services/eleve.service';

interface StudentFormatted {
  id: string;
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
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './attendance-sheet.component.html',
  styleUrls: ['./attendance-sheet.component.scss']
})

export class AttendanceSheetComponent implements OnInit {
  baseAmount: number = 35;
  teacherPercent: number = 80;
  schoolPercent: number = 20;
  absenceReductionPercent: number = 15;
  totalAmount = 0;
  etudes: any[] = [];
  filteredStudents: StudentFormatted[] = [];
  isPrinting = false;
  allStudents: StudentFormatted[] = [];
  students: StudentFormatted[] = [];
  Allstudents: StudentFormatted[] = [];
  addingStudent: boolean = false;
  selectedEtude: any = null;
  newStudentName: string = '';

  constructor(private etudeService: EtudeService, private studentService: EleveService) {}

  ngOnInit(): void {
    this.fetchEtudes();
  }

  updatePercentages() {
    // Ensure percentages are valid
    this.teacherPercent = Math.max(0, Math.min(100, this.teacherPercent));
    this.schoolPercent = Math.max(0, Math.min(100, this.schoolPercent));
    
    // Adjust school percent to complement teacher percent
    this.schoolPercent = 100 - this.teacherPercent;
  }

  getTeacherFinalAmount(): number {
    const teacherAmount = this.totalAmount * (this.teacherPercent / 100);
    return teacherAmount;
  }

  updateAllStudentsAmount() {
    this.students.forEach(student => {
      this.updateStudentAmount(student);
    });
    this.updateTotalAmount();
  }

  fetchEtudes(): void {
    this.etudeService.getEtudes().subscribe(
      (data) => {
        console.log('Etudes data:', data);
        this.etudes = data;
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
    document.body.innerHTML = printContents!;
    window.print();
    document.body.innerHTML = originalContents;
    this.isPrinting = false;
  }

  onSelectEtude(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEtudeId = selectElement.value;
    this.selectedEtude = this.etudes.find(etude => etude.id === selectedEtudeId);

    if (this.selectedEtude) {
      this.fetchStudentsByLevel(this.selectedEtude.niveau);
    }

    this.etudeService.getElevesFromEtude(selectedEtudeId).subscribe(
      (data) => {
        if (data.eleves && data.eleves.length > 0) {
          this.students = data.eleves.map((student: Student) => {
            const studentFormatted = {
              id: student.id,
              name: `${student.nom} ${student.prenom}`,
              sessions: student.attendances.map(
                (attendance: any) => attendance.status
              ),
              amount: 0,
              notes: ''
            };
            this.updateStudentAmount(studentFormatted);
            return studentFormatted;
          });
          this.updateTotalAmount();
        } else {
          this.fetchAndSaveStudentsByLevel(selectedEtudeId, this.selectedEtude.niveau);
        }
      },
      (error) => {
        console.error('Error fetching Eleves from Etude:', error);
        this.fetchAndSaveStudentsByLevel(selectedEtudeId, this.selectedEtude.niveau);    
      }
    );
  }

  currentDate = new Date();

  fetchAndSaveStudentsByLevel(etudeId: string, niveau: string): void {
    this.studentService.getStudentsByNiveau(niveau).subscribe(
      (data) => {
        const eleveIds = data.map((student: Student) => student.id);
        const studentsFormatted = data.map((student: Student) => ({
          id: student.id,
          name: `${student.nom} ${student.prenom}`,
          sessions: Array(4).fill('+'),
          amount: this.baseAmount,
          notes: '',
        }));

        this.etudeService.addElevesToEtude(etudeId, eleveIds).subscribe(
          () => {
            console.log('Students added to Etude successfully.');
            this.students = studentsFormatted;
            this.saveDefaultAttendance(etudeId, eleveIds);
          },
          (error) => {
            console.error('Error adding students to Etude:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching students by level:', error);
        this.students = [];
      }
    );
  }

  saveDefaultAttendance(etudeId: string, eleveIds: string[]): void {
    if (!this.selectedEtude?.seances || this.selectedEtude.seances.length === 0) {
      console.error('No seances available for attendance.');
      return;
    }

    const seances = this.selectedEtude.seances;
    let currentIndex = 0;

    const processNextSeance = () => {
      if (currentIndex >= seances.length) {
        console.log('Default attendance saved for all seances.');
        return;
      }

      const seance = seances[currentIndex];
      const attendanceArray = eleveIds.map((eleveId) => ({
        eleveId,
        attendanceStatus: 'present',
      }));

      const attendanceData = { attendance: attendanceArray };

      this.etudeService.markAttendance(etudeId, seance.id, attendanceData).subscribe(
        (response) => {
          console.log(`Attendance saved for seance ID ${seance.id}:`, response);
          currentIndex++;
          processNextSeance();
        },
        (error) => {
          console.error(`Error saving attendance for seance ID ${seance.id}:`, error);
          currentIndex++;
          processNextSeance();
        }
      );
    };

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
    
    const etudeId = this.selectedEtude?.id;
    const seanceId = this.selectedEtude?.seances[sessionIndex]?.id;

    if (!etudeId || !seanceId) {
      console.error('Etude ID or Seance ID is missing.');
      return;
    }

    let attendanceStatus: string;
    if (session === '+') {
      attendanceStatus = 'absentwithreason';
      student.sessions[sessionIndex] = 'absentwithreason';
    } else if (session === 'absentwithreason') {
      attendanceStatus = 'absent';
      student.sessions[sessionIndex] = 'absent';
    } else {
      attendanceStatus = 'present';
      student.sessions[sessionIndex] = '+';
    }

    const attendanceData = {
      attendance: [
        {
          eleveId: student.id,
          attendanceStatus,
        },
      ],
    };

    this.etudeService.markAttendance(etudeId, seanceId, attendanceData).subscribe(
      (response) => {
        console.log('Attendance updated successfully:', response);
        this.updateStudentAmount(student);
      },
      (error) => {
        console.error('Error updating attendance:', error);
      }
    );

    this.updateStudentAmount(student);
  }

  updateStudentAmount(student: StudentFormatted) {
    let totalAmountForStudent = 0;
    const sessionAmount = this.baseAmount / 4;

    student.sessions.forEach((session) => {
      if (session === 'absentwithreason') {
        totalAmountForStudent += sessionAmount * (1 - this.absenceReductionPercent/100);
      } else {
        totalAmountForStudent += sessionAmount;
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
      const studentId = this.students[index].id;
      const etudeId = this.selectedEtude?.id;

      if (!etudeId) {
        console.error('Etude ID is missing.');
        return;
      }

      this.etudeService.removeStudentFromEtude(etudeId, studentId).subscribe(
        (response) => {
          console.log('Student deleted successfully:', response);
          this.students.splice(index, 1);
          this.updateTotalAmount();
        },
        (error) => {
          console.error('Error deleting student:', error);
          alert('حدث خطأ أثناء حذف الطالب.');
        }
      );
    }
  }

  startAddStudent(): void {
    this.addingStudent = true;
    this.newStudentName = '';
  }

  fetchStudentsByLevel(niveau: string): void {
    this.studentService.getStudentsByNiveau(niveau).subscribe(
      (data) => {
        this.Allstudents = data.map((student) => ({
          id: student.id,
          name: `${student.nom} ${student.prenom}`,
          sessions: Array(4).fill('+'),
          amount: this.baseAmount,
          notes: '',
        }));
        console.log('All students:', this.Allstudents);
      },
      (error) => {
        console.error('Error fetching students by level:', error);
        this.Allstudents = [];
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
    this.newStudentName = student.name;
    this.filteredStudents = [];
  }

  confirmAddStudent(): void {
    if (this.newStudentName.trim()) {
      const selectedStudent = this.Allstudents.find(student =>
        student.name.toLowerCase() === this.newStudentName.toLowerCase()
      );

      if (selectedStudent) {
        const studentExists = this.students.some(student => student.id === selectedStudent.id);

        if (studentExists) {
          alert('الطالب موجود بالفعل في الجدول!');
          return;
        }

        const eleveIds = [selectedStudent.id];

        this.etudeService.addElevesToEtude(this.selectedEtude.id, eleveIds).subscribe(
          () => {
            console.log('Student added to Etude successfully.');

            this.students.push({
              id: selectedStudent.id,
              name: selectedStudent.name,
              sessions: selectedStudent.sessions,
              amount: this.baseAmount,
              notes: selectedStudent.notes
            });

            this.filteredStudents = [];
            this.addingStudent = false;
            this.newStudentName = '';
            this.updateAllStudentsAmount();
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
    this.addingStudent = false;
  }
}
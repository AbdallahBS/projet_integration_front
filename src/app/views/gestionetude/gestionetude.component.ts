import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, CalendarEvent, CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CardModule } from '@coreui/angular';
import { Enseignant } from '../../models/enseignant.model';
import { EnseignantService } from '../../services/enseignant.service'; // New service for enseignants
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../services/class.service';
import { EtudeService } from '../../services/etude.service'; // Adjust the import path if needed

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { EventColor } from 'calendar-utils';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-gestionetude',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CalendarModule,
    CardModule,
    NgbModalModule,
    FlatpickrModule // Include FlatpickrModule if needed for date pickers
  ],
  templateUrl: './gestionetude.component.html',
  styleUrls: ['./gestionetude.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionetudeComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  refresh = new Subject<void>();
  // Add the missing properties
  teacherName: string = '';
  matiere: string = ''; // Holds the selected matiere
  timeFrom: string = ''; // Default value or leave empty
  timeTo: string = ''; 
  className: string = '';
  classLevel: string = '';
  seance: string = '';
  modalData!: {
    action: string;
    event: CalendarEvent;
    
  };
  enseignants: Enseignant[] = []; // Store fetched enseignants
  classes: any[] = []; // Store the fetched classes here
  selectedClass: string = ''; // To hold the selected class option

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [

  ];

  constructor(private modal: NgbModal,
              private enseignantService: EnseignantService,
              private classeService: ClassService ,
              private etudeService: EtudeService) { } 
  
  
  ngOnInit(): void {
    this.loadEnseignants(); 
    this.getclasses();
  }

  getclasses() {
    this.classeService.getAllClasses().subscribe(
      (response: any) => {
        if (response && response.classes) {
          this.classes = response.classes;
        }
      },
      (error) => {
        console.error('Error fetching classes:', error);
      }
    );
  }

  loadEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe(
      (enseignants) => {
        this.enseignants = enseignants; // Assign fetched enseignants to the property
      },
      (error) => {
        console.error('Error fetching enseignants', error);
      }
    );
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newStart,
        };
      }
      return iEvent;
    });
  
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    if (!this.matiere) {
      alert('يرجى اختيار الحصة قبل الإضافة.');
      return;
    }
  
    const lastColor = this.events.length
      ? this.events[this.events.length - 1].color
      : colors['blue']; // Default to blue if no events exist
  
    const formattedDate = this.viewDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });
    const eventDate = startOfDay(this.viewDate); // Single timestamp for both start and end

    this.events = [
      ...this.events,
      {
        title: `${this.matiere}`, // Title includes seance and date
        start: eventDate, // Use selected day as start
        end: endOfDay(this.viewDate), // Use selected day as end
        color: lastColor, // Retain the last chosen color
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  

  }
  
  
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  updateEventEnd(event: CalendarEvent): void {
    event.end = event.start; // Ensure end is always the same as start
    this.refresh.next(); // Trigger a refresh to update the view
  }


  validateData(): void {
    if (!this.matiere || !this.teacherName || !this.selectedClass || !this.timeFrom || !this.timeTo) {
        alert('يرجى التأكد من إدخال جميع الحقول المطلوبة.');
        return;
    }

    // Extract the list of seance dates in the required format (DD/MM)
    const seanceDates = this.events.map((event) =>
        new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(event.start)
    );

    // Format the final data to send
    const payload = {
        matiere: this.matiere,
        teacherId: this.enseignants.find((e) => e.nom === this.teacherName)?.id.toString() || null,
        classeName: this.selectedClass,
        timeFrom: this.timeFrom,
        timeTo: this.timeTo,
        seances: seanceDates,
    };

    if (!payload.teacherId) {
        alert('لم يتم العثور على المعلّم المختار.');
        return;
    }

    console.log('Final Data Payload:', payload);

    this.etudeService.submitEtudeData(
      payload.classeName,
      payload.timeFrom,
      payload.timeTo,
      payload.teacherId,
      payload.matiere,
      payload.seances
    ).subscribe(
      (response) => {
        console.log('Data successfully submitted:', response);
        alert('تم تقديم البيانات بنجاح.');
      },
      (error) => {
        console.error('Error submitting data:', error);
        alert('حدث خطأ أثناء تقديم البيانات.');
      }
    );
  
}
}


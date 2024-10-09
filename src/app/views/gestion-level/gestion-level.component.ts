import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LevelService } from '../../services/level.service';
import { Level } from '../../models/level.model';
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
  styleUrls: ['./gestion-level.component.scss']
})
export class LevelComponent implements OnInit {
  selectedLevelId: number | null = null;
  levels: Level[] = [];
  showForm = false;
  isSubmitting = false;
  searchName: string = '';
  filteredLevels: Level[] = [];
  levelData: Level = {
    id: 0,
    niveau: '',
    nomDeLevel: ''
  };

  constructor(private levelService: LevelService) {}

  ngOnInit(): void {
    this.fetchAllLevels();
  }

  fetchAllLevels(): void {
    this.levelService.getAllLevels().subscribe({
      next: (data) => {
        this.levels = data;
        this.filteredLevels = data;
      },
      error: (error) => {
        console.error('Error fetching Levels', error);
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    if (this.selectedLevelId) {
      this.levelService.updateLevel(this.selectedLevelId, this.levelData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showForm = false;
          this.fetchAllLevels();
          this.selectedLevelId = null;
          this.resetForm();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating Level', error);
        }
      });
    } else {
      this.levelService.addLevel(this.levelData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showForm = false;
          this.fetchAllLevels();
          this.resetForm();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding Level', error);
        }
      });
    }
  }

  deleteLevel(levelId: number): void {
    if (confirm('Are you sure you want to delete this level?')) {
      this.levelService.deleteLevel(levelId).subscribe({
        next: () => {
          this.fetchAllLevels();
        },
        error: (error) => {
          console.error('Error deleting Level', error);
        }
      });
    }
  }

  editLevel(level: Level): void {
    this.levelData = { ...level };
    this.showForm = true;
    this.selectedLevelId = level.id;
  }

  filterLevels(): void {
    this.filteredLevels = this.levels.filter(level => 
      level.nomDeLevel.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

  resetForm(): void {
    this.levelData = {
      id: 0,
      niveau: '',
      nomDeLevel: ''
    };
  }
}
import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common'; // Import CommonModule

import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { DashboardService } from '../../services/dashboard.service'; // Adjust the path as necessary

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface IUser {
  name: string;
  role: string;
  activity: string;
  time: string; // Make sure the field names match your API response
  avatar: string; // You might want to handle this depending on your logic
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [WidgetsDropdownComponent, CommonModule,TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent]
})
export class DashboardComponent implements OnInit {


  public users: IUser[] = [];

  constructor(private dashboardService: DashboardService) {}


  ngOnInit(): void {
    this.getHistorique();
  }


  getHistorique(): void {
    this.dashboardService.getHistorique().subscribe({
      next: (data) => {
        this.users = data.map(item => ({
          name: item.admin.username, // Mapping based on your API response structure
          role: item.role,
          activity: item.typeofaction,
          time: new Date(item.time).toLocaleString(), // Format time if needed
          avatar: './assets/images/avatars/profile.png', // Replace with actual avatar logic if needed
        }));
      },
      error: (err) => {
        console.error("Error fetching historique data:", err);
      }
    });
  }







}

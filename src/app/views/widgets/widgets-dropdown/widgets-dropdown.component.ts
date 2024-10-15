import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular';
import { DashboardService } from '../../../services/dashboard.service'; // Adjust the import path

@Component({
    selector: 'app-widgets-dropdown',
    templateUrl: './widgets-dropdown.component.html',
    styleUrls: ['./widgets-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective, ChartjsComponent]
})
export class WidgetsDropdownComponent implements OnInit {
  elevesCount: number = 0;
  enseignantsCount: number = 0;
  classesCount: number = 0;
  adminsCount: number = 0;
  constructor(private dashboardService: DashboardService
  ) {}



  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  loadDashboardCounts(): void {
    this.dashboardService.getDashboardCounts().subscribe(
      (data) => {
        this.elevesCount = data.elevesCount;
        this.enseignantsCount = data.enseignantsCount;
        this.classesCount = data.classesCount;
        this.adminsCount = data.adminsCount;
      },
      (error) => {
        console.error('Error fetching dashboard counts:', error);
      }
    );
  }




}




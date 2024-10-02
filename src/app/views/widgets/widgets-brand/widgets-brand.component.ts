import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { ColComponent, RowComponent, WidgetStatDComponent } from '@coreui/angular';
import { ChartData } from 'chart.js';

type BrandData = {
  icon: string
  values: any[]
  capBg?: any
  color?: string
  labels?: string[]
  data: ChartData
}

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  styleUrls: ['./widgets-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [RowComponent, ColComponent, WidgetStatDComponent, IconDirective, ChartjsComponent]
})
export class WidgetsBrandComponent implements AfterContentInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() withCharts?: boolean;
  // @ts-ignore
  chartOptions = {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  datasets = {
    borderWidth: 2,
    fill: true
  };
  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };
  brandData: BrandData[] = [
   
  ];

  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}

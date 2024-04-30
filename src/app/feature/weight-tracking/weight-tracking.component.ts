import { Component, OnInit, ViewChild } from '@angular/core';
import { WeightEntry } from './../shared/models/ WeightEntry.model';
import {DataService} from "../shared/services/data.service";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import {AuthService} from "../auth/auth.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-weight-tracking',
  templateUrl: './weight-tracking.component.html',
  styleUrl: './weight-tracking.component.scss'
})

export class WeightTrackingComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  private resource = '';
  isLoadingWeightEntriesList = false;
  public graphTimeDurations = [
    { key: '7 days ago', value: 7 * 24 * 60 * 60 * 1000 },
    { key: '14 days ago', value: 14 * 24 * 60 * 60 * 1000 },
    { key: '30 days ago', value: 30 * 24 * 60 * 60 * 1000 },
    { key: '60 days ago', value: 60 * 24 * 60 * 60 * 1000 },
  ];
  selectedGraphTime = this.graphTimeDurations[0].value;
  private userId = '';
  series = {
     dataSeries1: {
        weights: [],
        dates: []
     }
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService) {
  }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.userId || '$userId';
    this.resource = `diet/user/${this.userId}/weights`;
    if (!this.chartOptions) {
      this.getGraphData();
    }
  }

  getGraphData() {
        this.isLoadingWeightEntriesList = true;
        this.userId = this.authService.currentUserValue?.userId || '$userId';
        const addParamsToRout = `${this.resource}?duration=${this.selectedGraphTime}`;
        this.dataService.getOne(addParamsToRout).subscribe({
        next: (response: any) => {
           this.series = response.series;
           this.chartOptions = this.initialChartOptions();
           this.isLoadingWeightEntriesList = false;
        },
        error: (error) => {
            this.isLoadingWeightEntriesList = false;
        },
        complete: () => {
            this.isLoadingWeightEntriesList = false;
        }
      });
  }

  initialChartOptions(): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "Weight (kg)",
          data: this.series.dataSeries1.weights
        }
      ],
      chart: {
        type: "line",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "מעקב משקלים / ציר זמן",
        align: "center"
      },
      subtitle: {
        text: "",
        align: "center"
      },
      labels: this.series.dataSeries1.dates,
      xaxis: {
        type: "datetime",
        labels: {
          format: 'dd MMM yyyy'
        }
      },
      yaxis: {
        title: {
          text: 'Weight (kg)'
        },
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }
}

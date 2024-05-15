import { Component, OnInit, ViewChild } from '@angular/core';
import {DataService} from "../shared/services/data.service";
import { Subscription } from 'rxjs';
import {AuthService} from "../auth/auth.service";
import { ChartOptions } from '../shared/models/chart-options.model';
import { ChartComponent } from "ng-apexcharts";
import { ChartService } from './chart.service';
import { WeightDataService } from './weight-data.service';

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
  private weightTrackingSubscription: Subscription | undefined;
  private userId = '';

  constructor(
    private authService: AuthService,
    private chartService: ChartService,
    private weightDataService: WeightDataService) {
  }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue?.userId || '$userId';
    this.getGraphData();
  }

  getGraphData() {
        this.isLoadingWeightEntriesList = true;
        const resource = `diet/user/${this.userId}/weights`;
        const queryParam = { name: 'duration', value: this.selectedGraphTime };
        this.weightTrackingSubscription = this.weightDataService.getWeightData(resource, queryParam)
          .subscribe({
            next: (response: any) => {
              this.chartOptions = this.chartService.getChartOptions(response.series.dataSeries1);
              this.isLoadingWeightEntriesList = false;
            },
            error: (error) => {
              console.error('Error fetching weight data:', error);
              this.isLoadingWeightEntriesList = false;
            }
        });
  }

  ngOnDestroy() {
    if (this.weightTrackingSubscription) {
      this.weightTrackingSubscription.unsubscribe();
    }
  }  
}

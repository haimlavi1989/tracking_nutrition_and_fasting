import { Injectable } from '@angular/core';
import { ChartOptions } from '../shared/models/chart-options.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }

  getChartOptions(seriesData: { weights: number[], dates: string[] }): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "Weight (kg)",
          data: seriesData.weights
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
        text: "Weight Tracking / Timeline",
        align: "center"
      },
      subtitle: {
        text: "",
        align: "center"
      },
      labels: seriesData.dates,
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

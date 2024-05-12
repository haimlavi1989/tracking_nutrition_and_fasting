import { Component } from '@angular/core';
import { Diet } from '../shared/models/Diet'
import {DataService} from "../shared/services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  history: Diet[] = []; // Array to hold fasting history

  constructor(private dataService: DataService) { }

  private resource: string = `diet/?endTime[lte]=${ new Date().toISOString()}`;

  ngOnInit(): void {
    this.getHistory();
  }

  getHistory() {
      this.dataService.getAll(this.resource).subscribe({
        next: (history: any) => {
          this.history = history.data;
          //this.calculatePagination(1);
        },
        error: (error) => {
          console.error('Error fetching diets history:', error);
        }
    });
  }
  trackByFn(index: number, diet: Diet): string {
    return diet.id;
  }  
}

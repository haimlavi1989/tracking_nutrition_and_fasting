import { Component } from '@angular/core';
import {Diet} from "../shared/models/Diet";
import {DataService} from "../shared/services/data.service";
import { faCalendar, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {DietsService} from "./diets.service";

@Component({
  selector: 'app-diets',
  templateUrl: './diets.component.html',
  styleUrl: './diets.component.scss'
})
export class DietsComponent {
  diets: Diet[] = []; // Array to hold fasting history
  isLoadingDietsList = false;

  // Pagination
  public resultPerPageOptions = [10,30,50,100,200];
  public currentResultPerPage = this.resultPerPageOptions[0];
  public dietsListCurrentPageData: Diet[] = [];
  public numberOfPages = 1;
  public currentPage = 1;
  // Font awesome
  faCalendar: IconDefinition;
  faPlus: IconDefinition;
  // Add new item
  selectedDate = new Date();
  time_24_hours = 1 * 24 * 60 * 60 * 1000;
  selectedWeight = 0;

  constructor(
    private dataService: DataService,
    private dietsService: DietsService
  ) {
    this.faCalendar = faCalendar;
    this.faPlus = faPlus;
    if (this.diets.length === 0) {
        this.dietsService.getDiets().subscribe({
            next: (diets: any[]) => {
              this.diets = diets;
              this.calculatePagination(1);
            },
            error: (error) => {
              console.error('Error fetching diets:', error);
            }
        });
    }

    this.dietsService.dietsChanged.subscribe({
            next: (response: any) => {
              this.diets = response
              console.log('Fetched dietsChanged:', this.diets);
            },
            error: (error) => {
            },
            complete: () => {
            }
      });
  }
  handleDateSelection(event: Event) {
    const dateString = (event.target as HTMLInputElement).value;
    this.selectedDate = new Date(dateString);
  }
  handleWeightSelection(event: Event) {
      const dateString = (event.target as HTMLInputElement).value;
      this.selectedWeight = Number(dateString);
  }
  createNewDiet() {
    if (this.selectedWeight === 0 || this.selectedWeight < 0) {
      alert("הכנס משקל תקין!")
      return
    }
    // check that the date is valid
    const currentDateTime = new Date().toISOString().slice(0, -8);
    if (new Date(this.selectedDate) >= new Date(currentDateTime)) {
      const startTime = new Date(this.selectedDate);
      // Adding 24 hours
      const endTime = new Date(startTime.getTime() + this.time_24_hours);
      // save in db
      const diet = new Diet(
        '',
        startTime,
        endTime,
        [],
        '',
        this.selectedWeight
      )
      console.log(diet)
      this.isLoadingDietsList = true;
      this.dietsService.createDiet(diet).subscribe({
          next: (response: any) => {
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.isLoadingDietsList = false;
          }
      });

    } else {
      alert("Selected start time has passed:" + this.selectedDate);
    }
  }
  calculatePagination(page = 1) {
      this.currentPage = page;
      this.numberOfPages = Math.ceil(this.diets.length / this.currentResultPerPage);
      const start = (page - 1) * this.currentResultPerPage;
      const end = (page) * this.currentResultPerPage;
      this.dietsListCurrentPageData = this.diets.slice(start, end);
  }
}

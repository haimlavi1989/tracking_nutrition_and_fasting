import { Component } from '@angular/core';
import {Diet} from "../shared/models/Diet";
import {DataService} from "../shared/services/data.service";
import { faCalendar, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {DietsService} from "./diets.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diets',
  templateUrl: './diets.component.html',
  styleUrl: './diets.component.scss'
})
export class DietsComponent {
  diets: Diet[] = []; // Array to hold fasting history
  isLoadingDietsList = false;

  // Pagination
  public resultPerPageOptions = [3,5];
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
  // Subscription
  private getDietsSubscription: Subscription | undefined;
  private dietsChangedSubscription: Subscription | undefined;
  private createDietSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private dietsService: DietsService
  ) {
    this.faCalendar = faCalendar;
    this.faPlus = faPlus;
    if (this.diets.length === 0) {
      this.getDiets();
    }

    this.dietsChangedSubscription = this.dietsService.dietsChanged.subscribe({
        next: (response: any) => {
          this.diets = response
        },
        error: (error) => {
        },
        complete: () => {
        }
    });
  }
  getDiets() {
    this.isLoadingDietsList = true;
    this.getDietsSubscription = this.dietsService.getDiets(this.currentPage, this.currentResultPerPage).subscribe({
      next: (response: any) => {
        this.isLoadingDietsList = false;
        this.diets = response.diets;
        this.numberOfPages = Math.ceil(response.totalItems / this.currentResultPerPage);
      },
      error: (error) => {
        this.isLoadingDietsList = false;
        console.error('Error fetching diets:', error);
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
      this.createDietSubscription = this.dietsService.createDiet(diet).subscribe({
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
  // calculatePagination(page = 1, pagesSum = 1) {
  //     this.currentPage = page;
  //     this.numberOfPages = Math.ceil(this.diets.length / this.currentResultPerPage);
  // }
  ngOnDestroy() {
    if (this.getDietsSubscription) {
      this.getDietsSubscription.unsubscribe();
    }
    if (this.dietsChangedSubscription) {
      this.dietsChangedSubscription.unsubscribe();
    }
    if (this.createDietSubscription) {
      this.createDietSubscription.unsubscribe();
    }
  }
  trackByFn(index: number, diet: Diet): string {
    return diet.id;
  }
  handlePageChange(page: number) {
    this.currentPage = page;
    this.getDiets();
  }
}

import {Component, Input, AfterViewInit, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { Diet } from '../shared/models/Diet'
import {faTrash, faPencil, faSave, faBell, faPlus, IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {DietsService} from "../diets/diets.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrl: './diet.component.scss'
})
export class DietComponent implements OnChanges,OnDestroy {
   @Input('diet') diet: Diet = new Diet();
   // Font awesome
   faTrash: IconDefinition;
   faPencil: IconDefinition;
   faSave: IconDefinition;
   faBell: IconDefinition;
   faPlus: IconDefinition;
   confirmationDialogMessage = "האם אתה בטוח?";
   warnBeforeDelete = false;
   isEditDiet = false;
   time_24_hours = 1 * 24 * 60 * 60 * 1000;
   dietOBJCopy: Diet = new Diet();
   selectedDate = new Date();
   isLoadingDiet = false;
   isShowingReminderComponent = false;
   groups: string[][] = [];
   newFoodItem: string = 'מאכל חדש';
   isEditFoodList = false;
   private deleteDietSubscription:  Subscription | undefined;
   private updateDietSubscription: Subscription | undefined;
   private updateSpecificDietSubscription: Subscription | undefined;
   errorMessage = ''

   constructor(
      private dietsService: DietsService,
    ) {
      this.faTrash = faTrash;
      this.faPencil = faPencil;
      this.faSave = faSave;
      this.faBell = faBell;
      this.faPlus = faPlus;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('diet' in changes) {
            this.groups = this.getGroups();
        }
    }
    deleteDietRecord() {
      this.confirmationDialogMessage = "האם אתה בטוח שברצונך למחוק?";
      // Open Delete warning popup
      this.warnBeforeDelete = true;
    }
    handleDeleteSelection(selection: boolean) {
       if (selection) {
             this.isLoadingDiet = true;
             this.deleteDietSubscription = this.dietsService.deleteDiet(this.diet.id).subscribe({
                  next: () => {
                    console.log(`Diet was deleted`);
                  },
                  error: error => {
                    console.error('Error deleting diet:', error);
                  },
                  complete: () => {
                    this.isLoadingDiet = false;
                  }
             });
        }
        this.warnBeforeDelete = false;
        this.confirmationDialogMessage = '';
    }
    startEditSpecificDiet() {
        this.isEditDiet = !this.isEditDiet;
        this.dietOBJCopy = structuredClone(this.diet);
    }
    handleDateSelected(event: Event) {
        const dateString = (event.target as HTMLInputElement).value;
        this.dietOBJCopy.startTime = new Date(dateString);
        this.dietOBJCopy.endTime = this.add24HoursFromStartTime();
    }
    add24HoursFromStartTime() {
      return new Date(this.dietOBJCopy.startTime.getTime() + this.time_24_hours);
    }
    setAlert() {
    this.isShowingReminderComponent = true;
    }
    handleUpdatingSpecificDiet() {
        // Abort the change if the user selected time is too old.
        if (new Date(this.dietOBJCopy.startTime).getTime() > new Date().getTime()) {
                alert('Selected time is to old please update your selection')
        } else {
          this.isLoadingDiet = true;
          this.updateSpecificDietSubscription = this.dietsService.updateDiet(this.diet.id, this.diet).subscribe({
                next: () => {
                  this.isEditDiet = !this.isEditDiet;
                  console.log(`Updating was Done`);
                },
                error: error => {
                  console.error('Error update diet:', error);
                },
                complete: () => {
                  this.isLoadingDiet = false;
                }
          });
        }
    }
    handleReminderComponent() {
        this.isShowingReminderComponent = !this.isShowingReminderComponent;
    }
   getGroups() {
        const groups = [];
        const numGroups = Math.ceil(this.diet.foodList.length / 5);
        let startIndex = 0;

        for (let i = 0; i < numGroups; i++) {
          groups.push(this.diet.foodList.slice(startIndex, startIndex + 5));
          startIndex += 5;
        }
        return groups;
   }

    flattenGroups(): string[] {
        return this.groups.reduce((acc, val) => acc.concat(val), []);
    }

    addToGroups() {
        let added = false;
        const maxGroups = 4;
        const maxItems = 15;

        if (this.groups.length >= maxGroups) {
            return;
        }
        const totalItems = this.groups.reduce((acc, group) => acc + group.length, 0);
        if (totalItems >= maxItems) {
            return;
        }
        this.groups.forEach(group => {
            if (group.length < 5 && !added) {
                group.push(this.newFoodItem);
                added = true;
            }
        });
        if (!added) {
            this.groups.push([this.newFoodItem]);
        }
    }
    deleteProduct(groupIndex: number, productIndex: number) {
        this.groups[groupIndex].splice(productIndex, 1);
    }
    startEditFoodList() {
       this.isEditFoodList = !this.isEditFoodList
    }
    handleUpdatingFoodList() {
          this.diet.foodList = this.flattenGroups();
          this.isLoadingDiet = true;
          this.updateDietSubscription = this.dietsService.updateDiet(this.diet.id, this.diet).subscribe({
                next: () => {
                  this.isEditFoodList = !this.isEditFoodList;
                  this.isLoadingDiet = false;
                },
                error: error => {
                  this.isLoadingDiet = false;
                  console.error('Error deleting diet:', error);
                },
                complete: () => {
                  this.isLoadingDiet = false;
                }
          });
    }
    handleError() {

    }
    ngOnDestroy() {
      if (this.deleteDietSubscription) {
        this.deleteDietSubscription.unsubscribe();
      }
      if (this.updateSpecificDietSubscription) {
        this.updateSpecificDietSubscription.unsubscribe();
      }
      if (this.updateDietSubscription) {
        this.updateDietSubscription.unsubscribe();
      }
    }  
}

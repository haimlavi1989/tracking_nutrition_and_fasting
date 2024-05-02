import { Injectable } from '@angular/core';
import {Subject, Observable, map} from 'rxjs';
import { Diet } from '../shared/models/Diet';
import {DataService} from "../shared/services/data.service";
import {tap} from "rxjs/operators";

// interface Response {
//   status: number;
//   data: Diet;
// }
// this class will hold & mange Diets data CRUD
@Injectable()
export class DietsService {

  public dietsChanged = new Subject<Diet[]>();
  private diets!: Diet[];
  private resource: string = `diet/?endTime[gte]=${ new Date().toISOString()}`;

  constructor(
    private dataService: DataService,
  ) {
  }

  setDiets(diets: Diet[]) {
    this.diets = diets;
    this.dietsChanged.next(this.diets?.slice());
  }

  getDiets(): Observable<Diet[]> {
    if (this.diets) {
      // If diets array already contains data, return it as an observable
      return new Observable<any[]>(observer => {
        observer.next(this.diets.slice());
        observer.complete();
      });
    } else {
      // If diets array is empty, make an HTTP request to fetch data
      return this.dataService.getAll(this.resource).pipe(
        tap((response: any) => {
          // Set diets
          this.diets = response.data;
        }),
        // Return a copy of the fetched data
        map(() => this.diets?.slice())
      );
    }
  }

  getDiet(id: string) {
    if (!this.diets) {
      return
    }
    const dietIndex = this.diets.findIndex(diet => diet.id === id);
    return this.diets[dietIndex];
  }

  createDiet(dietResource: Diet): Observable<Diet> {
      return this.dataService.create(this.resource, dietResource).pipe(
        tap((response: any) => {
            const dietObj: Diet = response.data.diet;
            this.diets.unshift(dietObj);
            this.dietsChanged.next(this.diets?.slice());
        }),
      );
  }

  updateDiet(id: string, newDiet: Diet) {
    const dietIndex = this.diets.findIndex(diet => diet.id === id);
     return this.dataService.update(this.resource, newDiet).pipe(
          tap((response: any) => {
              if (response.status && response.status === 200) {
                this.diets[dietIndex] = newDiet;
                this.dietsChanged.next(this.diets?.slice());
              }
          }),
     );
  }

  deleteDiet(dietID: string): Observable<any> {
    return this.dataService.delete(this.resource, dietID).pipe(
      tap(() => {
        // If successful, also delete the record from the local
        this.deleteLocalDiet(dietID);
      })
    );
  }

  private deleteLocalDiet(dietID: string) {
    const dietIndex = this.diets.findIndex(diet => diet.id === dietID);
    this.diets?.splice(dietIndex, 1);
    this.dietsChanged.next(this.diets?.slice());
  }
}

import { Injectable } from '@angular/core';
import { Diet } from '../shared/models/Diet';
import {DataService} from "../shared/services/data.service";
import {tap, catchError, map, } from "rxjs/operators";
import {Subject, Observable, of} from 'rxjs';

interface DietResponse {
  diets: Diet[];
  totalItems: number;
}

// this class will hold & mange Diets data CRUD
@Injectable()
export class DietsService {

  public dietsChanged = new Subject<Diet[]>();
  private diets: Diet[] = [];
  private resource: string = `diet/`;
  totalItems = 0;

  constructor(
    private dataService: DataService,
  ) {
  }

  setDiets(diets: Diet[]) {
    this.diets = diets;
    this.dietsChanged.next(this.diets?.slice());
  }

  getDiets(page=1, limit=2): Observable< DietResponse> {
        // Check if diets are already cached
        if (this.diets.length > 0) {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedDiets = this.diets.slice(startIndex, endIndex);
          if (paginatedDiets.length > 0) {
            return of({ diets: paginatedDiets, totalItems: this.totalItems }); // Return cached data
          }
        }
        // Fetch data from the server if no data available or client requested different page
        const resource = this.resource + `?endTime[gte]=${ new Date().toISOString()}` + `&page=${page}&limit=${limit}`;
        return this.dataService.getAll(resource).pipe(
          tap((response: any) => {
            // Update cache with fetched data
            this.diets = [...this.diets, ...response.data];
            this.totalItems = response.fullResoults
          }),
          map(() => {
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedDiets = this.diets.slice(startIndex, endIndex);
            return { diets: paginatedDiets, totalItems: this.totalItems } // Return paginated data
          }),
          catchError((error) => {
            console.error(error);
            return of({ diets: [], totalItems: 0 });
          })
        );
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
    if (dietIndex !== -1) {
      this.diets?.splice(dietIndex, 1);
      this.dietsChanged.next(this.diets?.slice());
    }
  }
}

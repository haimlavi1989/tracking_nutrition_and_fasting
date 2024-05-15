import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class WeightDataService {
  constructor(private dataService: DataService) { }

  getWeightData(resource: string, queryParam: { name: string, value: any }): Observable<any> {
    let url = `${resource}`;
    if (queryParam.name) {
      url = `${resource}?${queryParam.name}=${queryParam.value}`;
    }
    return this.dataService.getOne(url);
  }
}
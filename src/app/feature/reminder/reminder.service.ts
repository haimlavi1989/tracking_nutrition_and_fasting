// src/app/shared/services/reminder.service.ts

import { Injectable } from '@angular/core';
import { DataService } from './../shared/services/data.service';
import { Reminder } from './../shared/models/Reminder';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private resource = 'reminder';

  constructor(private dataService: DataService) {}

  getReminder(reminderId: string): Observable<any> {
    const route = `${this.resource}/${reminderId}`;
    return this.dataService.getOne(route).pipe(
      map((response: any) => response.data as Reminder)
    );
  }

  updateReminder(reminder: Reminder): Observable<any> {
    return this.dataService.update(this.resource, reminder).pipe(
      map((response: any) => response.data as Reminder)
    );
  }
}

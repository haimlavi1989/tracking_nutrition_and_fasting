import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ReminderService } from './reminder.service';
import { Reminder } from '../shared/models/Reminder';
import { faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss'] // Corrected from styleUrl to styleUrls
})
export class ReminderComponent implements OnChanges, OnDestroy {
  @Input('reminderId') reminderId = '';
  @Output() closeComponent = new EventEmitter<void>();

  public reminder = new Reminder();
  public faSave: IconDefinition;
  public reminderTimeOptionsArray = [
    { key: '5 minutes', value: 1 * 5 * 60 * 1000 },
    { key: '10 minutes', value: 1 * 10 * 60 * 1000 },
    { key: '20 minutes', value: 1 * 20 * 60 * 1000 },
    { key: '30 minutes', value: 1 * 30 * 60 * 1000 },
    { key: '1 hour', value: 1 * 60 * 60 * 1000 },
  ];
  public isLoadingReminderList = false;
  private getOneReminderSubscription: Subscription | undefined;

  constructor(private reminderService: ReminderService) {
    this.faSave = faSave;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('reminderId' in changes) {
      const reminderIdChange = changes['reminderId'];
      if (reminderIdChange.currentValue !== reminderIdChange.previousValue) {
        this.loadReminder(this.reminderId);
      }
    }
  }

  loadReminder(reminderId: string) {
    this.isLoadingReminderList = true;
    this.getOneReminderSubscription = this.reminderService.getReminder(reminderId).subscribe({
      next: (response: any) => {
        console.log('response', response)
        this.reminder = response;
        this.isLoadingReminderList = false;
      },
      error: () => {
        this.isLoadingReminderList = false;
      }
    });
  }

  saveRemindersChanges() {
    this.isLoadingReminderList = true;
    this.reminderService.updateReminder(this.reminder).subscribe({
      next: () => {
        this.isLoadingReminderList = false;
      },
      error: () => {
        this.isLoadingReminderList = false;
      }
    });
  }

  handleCloseEvent() {
    this.closeComponent.emit();
  }

  ngOnDestroy() {
    if (this.getOneReminderSubscription) {
      this.getOneReminderSubscription.unsubscribe();
    }
  }
}

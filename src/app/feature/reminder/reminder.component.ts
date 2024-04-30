import {Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {DataService} from "../shared/services/data.service";
import {Reminder} from "../shared/models/Reminder";
import {faSave, IconDefinition} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss'
})
export class ReminderComponent implements OnChanges {
  @Input('reminderId') reminderId = '';
  @Output() closeComponent = new EventEmitter<void>();

  private resource = 'reminder';
  public reminder = new Reminder()
  public faSave: IconDefinition;
  public reminderTimeOptionsArray = [
    { key: '5 minutes', value: 1 * 5 * 60 * 1000 },
    { key: '10 minutes', value: 1 * 10 * 60 * 1000 },
    { key: '20 minutes', value: 1 * 20 * 60 * 1000 },
    { key: '30 minutes', value: 1 * 30 * 60 * 1000 },
    { key: '1 hour', value: 1 * 60 * 60 * 1000 },
  ];
  public isLoadingReminderList = false;

  constructor(
      private dataService: DataService,
  ) {
      this.faSave = faSave;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('reminderId' in changes) {
      const reminderIdChange = changes['reminderId'];
      if (reminderIdChange.currentValue !== reminderIdChange.previousValue) {
            const deleteRoute = `${this.resource}/${this.reminderId}`;
            this.isLoadingReminderList = true;
            this.dataService.getOne(deleteRoute).subscribe({
                  next: (response: any) => {
                    this.reminder = response.data
                    this.isLoadingReminderList = false;
                  },
                  error: (error) => {
                    this.isLoadingReminderList = false;
                  },
                  complete: () => {
                    this.isLoadingReminderList = false;
                  }
            });
      }
    }
  }
  saveRemindersChanges() {
        this.isLoadingReminderList = true;
        const reminderData = new Reminder();
        reminderData.id = this.reminder.id
        reminderData.timeToAlertBeforeNutritionStart = this.reminder.timeToAlertBeforeNutritionStart;
        reminderData.timeToAlertBeforeFastingStart = this.reminder.timeToAlertBeforeFastingStart;

        this.dataService.update(this.resource, reminderData).subscribe({
              next: (response: any) => {
                this.isLoadingReminderList = false;
              },
              error: (error) => {
                this.isLoadingReminderList = false;
              },
              complete: () => {
                this.isLoadingReminderList = false;
              }
        });
    }
    handleCloseEvent() {
      this.closeComponent.emit();
    }
}

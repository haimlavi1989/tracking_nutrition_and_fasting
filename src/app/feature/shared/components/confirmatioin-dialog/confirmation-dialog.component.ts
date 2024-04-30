import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  @Input() message: string = 'Are you sure?';
  @Output() userSelectionEmitter = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  // ok=true, cancel/exit=false
  buttonChoice(confirmOrCancel: boolean) {
     this.userSelectionEmitter.emit(confirmOrCancel);
  }
}

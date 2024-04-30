import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template:
    '<div *ngIf="visible" class="lds-ripple"><div></div><div></div></div>',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input("visible") visible = true; 
}

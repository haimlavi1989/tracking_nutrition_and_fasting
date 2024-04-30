import { Component } from '@angular/core';
import { Diet } from '../shared/models/Diet'
import data from '../shared/data/fast.json'
import {DataService} from "../shared/services/data.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  upcoming: Diet[] = []; // Array to hold upcoming fasts
  history: Diet[] = []; // Array to hold fasting history

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getUpcomingFasts();
  }

  getUpcomingFasts() {

  }
}

import {
	Component,
    OnInit,
	Input,
	Output,
	EventEmitter }   from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit {

    @Output('page-changed') pageChanged = new EventEmitter();
	@Input('last-page') lastPage  = -1;
    @Input('current-page') currentPage  = -1;

    constructor() { }

    ngOnInit(): void {
    }
	previous() {
		if (this.currentPage === 1)
			return;

		this.currentPage--;
		this.pageChanged.emit(this.currentPage);
	}
	next() {
		if (this.currentPage === this.lastPage)
		return;
		this.currentPage++;
		this.pageChanged.emit(this.currentPage);
	}
}

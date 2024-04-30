import {
	Component,
	Input,
	Output,
	EventEmitter }   from '@angular/core';

@Component({
	selector: 'pagination',
    template: `
    <nav>
        <ul class="pagination">
            <li *ngIf="currentPage !== 1">
                <a (click)="previous()" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                </a>
			</li>
			<li>
               {{ currentPage }}
            </li>
            <li *ngIf="currentPage !== lastPage">
                <a (click)="next()" aria-label="Next">
                 <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
`
})
export class PaginationComponent {
	@Output('page-changed') pageChanged = new EventEmitter();
	@Input('last-page') lastPage = -1;

	currentPage: number = 1;

	previous(){
		if (this.currentPage === 1)
			return;

		this.currentPage--;
		this.pageChanged.emit(this.currentPage);
	}

	next(){
		if (this.currentPage === this.lastPage)
		return;
		this.currentPage++;
		this.pageChanged.emit(this.currentPage);
	}
}

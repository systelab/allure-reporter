import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector:    'app-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

	@Input() toggleResults;

	@Output() toggleResultsChange = new EventEmitter<boolean>();

	public doResultsClick() {
		this.toggleResults = !this.toggleResults;
		this.toggleResultsChange.emit(this.toggleResults);
	}
}

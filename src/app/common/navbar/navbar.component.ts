import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector:    'app-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

	@Input() toggleResults;
	@Output() toggleResultsChange = new EventEmitter<boolean>();

	@Input() toggleSummary;
	@Output() toggleSummaryChange = new EventEmitter<boolean>();

	@Input() toggleUser;
	@Output() toggleUserChange = new EventEmitter<boolean>();

	@Input() toggleReport;
	@Output() toggleReportChange = new EventEmitter<boolean>();

	public doResultsClick() {
		this.toggleResults = !this.toggleResults;
		this.toggleResultsChange.emit(this.toggleResults);
	}

	public doSummaryClick() {
		this.toggleSummary = !this.toggleSummary;
		this.toggleSummaryChange.emit(this.toggleSummary);
	}

	public doUserClick() {
		this.toggleUser = !this.toggleUser;
		this.toggleUserChange.emit(this.toggleUser);
	}

	public doReportClick() {
		this.toggleReport = !this.toggleReport;
		this.toggleReportChange.emit(this.toggleReport);
	}
}

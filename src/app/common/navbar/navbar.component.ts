import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector:    'app-navbar',
	templateUrl: 'navbar.component.html',
	styleUrls: ['navbar.component.scss']
})
export class NavbarComponent {

	@Input() toggleResults;
	@Input() isLogged;
	@Input() allFilesProcessed;
	@Output() toggleResultsChange = new EventEmitter<boolean>();

	@Input() toggleSummary;
	@Output() toggleSummaryChange = new EventEmitter<boolean>();

	@Output() user = new EventEmitter();

	@Output() report = new EventEmitter();

	public doResultsClick() {
		this.toggleResults = !this.toggleResults;
		this.toggleResultsChange.emit(this.toggleResults);
	}

	public doSummaryClick() {
		this.toggleSummary = !this.toggleSummary;
		this.toggleSummaryChange.emit(this.toggleSummary);
	}

	public doUserClick() {
		this.user.emit();
	}

	public doReportClick() {
		this.report.emit();
	}
}

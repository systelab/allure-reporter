import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare var Nanobar: any;

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements AfterViewInit {

	@Input() toggleResults;
	@Input() isLogged;
	@Input() allFilesProcessed;
	@Output() toggleResultsChange = new EventEmitter<boolean>();

	@Input() toggleSummary;
	@Output() toggleSummaryChange = new EventEmitter<boolean>();

	@Output() user = new EventEmitter();

	@Output() report = new EventEmitter();

	@Output() clean = new EventEmitter();

	@ViewChild('progress') progress: ElementRef;

	private nanobar: any;

	public ngAfterViewInit() {
		if (this.progress) {
			const options = {
				target: this.progress.nativeElement
			};
			this.nanobar = new Nanobar(options);
		}
	}

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

	public go(n: number) {
		if (this.nanobar) {
			if (n > 100) {
				n = 100;
			}
			this.nanobar.go(n); // size bar 30%
		}
	}

	public doCleanClick() {
		this.clean.emit();
	}
}

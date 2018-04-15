import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector:    'app-report',
	templateUrl: 'report.component.html'
})
export class ReportComponent {

	@Output() public close = new EventEmitter();

	public doClose() {
		this.close.emit();
	}
}

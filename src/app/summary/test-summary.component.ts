import { Component } from '@angular/core';

export class StatusCounter {
	public constructor(public name: string, public items: number) {
	}

	public isPassed() {
		return (this.name === 'passed');
	}

	public getPrinteableName() {
		if (this.name === 'passed') {
			return 'Passed';
		} else {
			return 'Failed';
		}
	}
}

@Component({
	selector:    'test-summary',
	templateUrl: 'test-summary.component.html'
})
export class TestSummaryComponent {

	public statuses: StatusCounter[] = [];

	public constructor() {
		this.statuses.push(new StatusCounter('passed', 34));
		this.statuses.push(new StatusCounter('failed', 2));

	}

}

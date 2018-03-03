import { Component, Input } from '@angular/core';
import { Step } from './model';

@Component({
	selector:    'test-steps',
	templateUrl: 'test-steps.component.html',
	styleUrls:   ['test-steps.component.css']
})
export class TestStepsComponent {

	@Input() steps: Step[] = [];
	@Input() withHeader = true;
	@Input() level = 0;

	public getTimeSpendInStep(step: Step) {
		if (step) {
			const duration = step.stop - step.start;
			return duration + ' ms';
		}
		return '-';
	}

	public hasChildren(step: Step) {
		return (step && step.steps && step.steps.length > 0);
	}

	public isCheck(step: Step) {
		return (step && step.name.startsWith('Check'));
	}
}

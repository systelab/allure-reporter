import { Component, Input } from '@angular/core';
import { Step } from '../../../model/allure-test-case.model';

@Component({
	selector:    'test-steps',
	templateUrl: 'test-steps.component.html',
	styleUrls:   ['test-steps.component.scss']
})
export class TestStepsComponent {

	@Input() steps: Step[] = [];
	@Input() withHeader = true;
	@Input() level = 0;
	@Input() showResults = true;
	@Input() action: '';

	public getTimeSpendInStep(step: Step) {
		return step ? (step.stop - step.start) + ' ms' : '-';
	}

	public hasChildren(step: Step) {
		return (step && step.steps && step.steps.length > 0);
	}

	public hasExpectedResult(step: Step) {
		if (step.expectedResult) {
			return true;
		}
		return false;
	}

	public getActionInHTML(action: string, step: Step): string {
		let actionInHTML = '';
		if (action) {
			actionInHTML = action;
		}
		if (step) {
			actionInHTML += step;
		}
		return actionInHTML;
	}
}

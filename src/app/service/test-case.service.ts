import { Injectable } from '@angular/core';
import { Step, TestCase } from '../model/allure-test-case.model';

@Injectable({
	providedIn: 'root'
})
export class TestCaseService {

	static STEP_TYPE_EXPECTED_RESULT = 'Expected result:';
	static STEP_TYPE_ACTION = 'Action:';

	public getTmsLink(testCase: TestCase): string {
		if (testCase.links) {
			const link = testCase.links.find((l) => l.type === 'tms');
			return link ? link.name : '';
		}
		return '';
	}

	public getTmsTestName(testCase: TestCase): string {
		if (testCase.links) {
			const link = testCase.links.find((l) => l.type === 'testName');
			return link ? link.name : '';
		}
		return '';
	}

	public getTmsDescription(testCase: TestCase): string {
		if (testCase.labels) {
			const label = testCase.labels.filter((l) => l.name === 'feature').map((l) => l.value).join(' - ');
			return label ? label : '';
		}
		return '';
	}

	public getActualResults(testCase: TestCase): string {
		if (testCase.labels) {
			const label = testCase.labels.find((l) => l.name === 'actualResults');
			return label ? label.value : '';
		}
		return '';
	}

	public followTestCaseStructure(elementSteps: Step[], level: number, isFirstStep: boolean, parentStep ?: Step): Step[] {
		const steps: Step[] = [];

		for (let j = 0; elementSteps && j < elementSteps.length; j++) {
			let isActionResult = false;
			let stepName = elementSteps[j].name;

			// Set isActionResult and Replace Action: and Expected result:
			if (elementSteps[j].expectedResult || stepName.includes(TestCaseService.STEP_TYPE_EXPECTED_RESULT)) {
				isActionResult = false;
				stepName = stepName.replace(TestCaseService.STEP_TYPE_EXPECTED_RESULT, '');
			} else {
				if (stepName && (elementSteps[j].isAction || stepName.includes(TestCaseService.STEP_TYPE_ACTION))) {
					isActionResult = true;
					stepName = stepName.replace(TestCaseService.STEP_TYPE_ACTION, '');
				}
			}

			if (isFirstStep && j === 0) {
				steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
			} else {
				const previousOrParentStep = steps.length > 0 ? steps[steps.length - 1] : parentStep;

				if (isActionResult) {		// Current step is an Action
					if (previousOrParentStep.expectedResult) { // Create a new Step for the Action
						steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
					} else { // Add the action to the previous Step
						previousOrParentStep.action = previousOrParentStep.action ? previousOrParentStep.action + this.addStepSeparator(stepName, level) : stepName;
						if (elementSteps[j].steps && elementSteps[j].steps.length > 0) {
							const subSteps: Step[] = this.followTestCaseStructure(elementSteps[j].steps, level + 1, false, previousOrParentStep);
							previousOrParentStep.steps = subSteps;
						}
					}
				} else { // Current Step is an Expected Result
					if (previousOrParentStep.expectedResult) {
						steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
					} else {
						previousOrParentStep.expectedResult = stepName;
						if (elementSteps[j].steps && elementSteps[j].steps.length > 0) {
							const subSteps: Step[] = this.followTestCaseStructure(elementSteps[j].steps, level + 1, false, previousOrParentStep);
							previousOrParentStep.steps = subSteps;
						}
					}
				}
			}
		}
		return steps;
	}

	private addStepSeparator(stepName: string, level: number): string {
		const rightMargin = 2 * (level + 1);
		return '<div class="ml-' + rightMargin + '">' + stepName + '</div>';
	}

	private addNewStep(elementStep: Step, stepName: string, level: number, isActionResult: boolean): Step {
		const step: Step = {
			name:           '',
			action:         isActionResult ? this.addStepSeparator(stepName, level) : undefined,
			expectedResult: isActionResult ? undefined : stepName || elementStep.expectedResult,
			status:         elementStep.status,
			statusDetails:  undefined,
			stage:          '',
			start:          Number(elementStep.start),
			stop:           Number(elementStep.stop),
			parameters:     [],
			steps:          [],
			numberOfStep:   '',
			isAction:       isActionResult
		};
		if (elementStep.steps && elementStep.steps.length > 0) {
			step.steps = this.followTestCaseStructure(elementStep.steps, level + 1, false, step);
		}
		return step;
	}
}

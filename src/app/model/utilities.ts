import { TestCase, Step } from './test-case.model';

export class Utilities {

	static STEP_TYPE_EXPECTED_RESULT = 'Expected result:';
	static STEP_TYPE_ACTION = 'Action:';

	public static getTmsLink(test: TestCase): string {
		if (!test.links) {
			return '';
		}
		for (const link of test.links) {
			if (link.type === 'tms') {
				return link.name;
			}
		}
		return '';
	}

	public static getTmsDescription(test: TestCase): string {

		if (!test.labels) {
			return '';
		}
		for (const label of test.labels) {
			if (label.name === 'feature') {
				return label.value;
			}
		}
		return '';
	}

	public static getDateDetails(test: TestCase) {
		const date = new Date();
		date.setTime(test.start);
		const duration = test.stop - test.start;
		return this.formatDate(date) + '    (Duration ' + duration + ' ms)';
	}

	private static formatDate(date: Date) {
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const sMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
		const strTime = hours + ':' + sMinutes + ' ' + ampm;
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
	}

	public static followTestCaseStructure(elementSteps: Step[], level: number, isFirstStep: boolean, parentStep ?: Step): Step[] {
		const steps: Step[] = [];

		let isActionResult = false;
		for (let j = 0; elementSteps && j < elementSteps.length; j++) {
			let stepName = elementSteps[j].name;

			//Set isActionResult and Replace Action: and Expected result:
			if (elementSteps[j].expectedResult || stepName.includes(Utilities.STEP_TYPE_EXPECTED_RESULT)) {
				isActionResult = false;
				stepName = stepName.replace(this.STEP_TYPE_EXPECTED_RESULT, '');
			} else {
				if (stepName && (elementSteps[j].isAction || stepName.includes(Utilities.STEP_TYPE_ACTION))) {
					isActionResult = true;
					stepName = stepName.replace(this.STEP_TYPE_ACTION, '');
				} else {
					isActionResult = false;
				}
			}

			if (isFirstStep && j === 0) {
				steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
			} else {
				let previousOrParentStep: Step;
				if (steps.length > 0) {
					previousOrParentStep = steps[steps.length - 1];
				} else {
					previousOrParentStep = parentStep;
				}

				if (isActionResult) {		//Current step is an Action
					if (previousOrParentStep.expectedResult) { //Create a new Step for the Action
						steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
					} else { //Add the action to the previous Step
						previousOrParentStep.action = previousOrParentStep.action ? previousOrParentStep.action + this.addStepSeparator(stepName, level) : stepName;
						if (elementSteps[j].steps && elementSteps[j].steps.length > 0) {
							let subSteps: Step[] = this.followTestCaseStructure(elementSteps[j].steps, level + 1, false, previousOrParentStep);
							previousOrParentStep.steps = subSteps;
						}
					}
				} else { //Current Step is an Expected Result
					if (previousOrParentStep.expectedResult) {
						steps.push(this.addNewStep(elementSteps[j], stepName, level, isActionResult));
					} else {
						previousOrParentStep.expectedResult = stepName;
						if (elementSteps[j].steps && elementSteps[j].steps.length > 0) {
							let subSteps: Step[] = this.followTestCaseStructure(elementSteps[j].steps, level + 1, false, previousOrParentStep);
							previousOrParentStep.steps = subSteps;
						}
					}
				}
			}
		}
		return steps;
	}

	public static addStepSeparator(stepName: string, level: number): string {
		let rightMargin = 2 * (level + 1);
		return '<div class="ml-' + rightMargin + '">' + stepName + '</div>';
	}

	public static addNewStep(elementStep: Step, stepName: string, level: number, isActionResult: boolean): Step {
		const step: Step = {
			name:           '',
			action:         isActionResult ? this.addStepSeparator(stepName, level) : undefined,
			expectedResult: isActionResult ? undefined : stepName,
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

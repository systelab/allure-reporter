import { Injectable } from '@angular/core';
import { TestSuite } from '../model/allure-test-case.model';
import { ResultStatus } from './result-status.enum';

@Injectable({
	providedIn: 'root'
})
export class TestValidationService {

	public checkTestSteps(testrun, testSuite: TestSuite): ResultStatus {
		let notUpdateStatus = undefined;
		const correctStepCount = this.checkStepCountConsistency(testrun, testSuite);
		if (correctStepCount) {
			const correctExpectedResults = this.checkExpectedResultsMatch(testrun, testSuite)
			if (correctExpectedResults) {
				const correctActions = this.checkActionsMatch(testrun, testSuite);
				if (!correctActions) {
					notUpdateStatus = ResultStatus.NotUpdatedWrongActions;
				}
			} else {
				notUpdateStatus = ResultStatus.NotUpdatedWrongExpectedResults;
			}
		} else {
			notUpdateStatus = ResultStatus.NotUpdatedWrongSteps;
		}
		return notUpdateStatus;
	}

	private checkStepCountConsistency(testrun, testSuite: TestSuite): boolean {
		const testRunStepsLength = testrun.fields.testRunSteps?.length || 0;
		const totalSteps = testSuite.testCases.reduce((sum, testCase) => sum + this.getStepsCount(testCase.steps), 0);
		return testRunStepsLength === totalSteps;
	}

	private getStepsCount(steps: any[]): number {
		return (steps || []).reduce((count, step) => count + 1 + this.getStepsCount(step.steps), 0);
	}

	private checkExpectedResultsMatch(testrun, testSuite: TestSuite): boolean {
		if (!testrun.fields?.testRunSteps) {
			return false;
		}

		let currentIndex = 0;
		const testRunSteps = testrun.fields.testRunSteps;

		const checkStepsRecursive = (steps: any[]) => {
			if (!steps) {
				return true;
			}
			for (const step of steps) {
				if (currentIndex >= testRunSteps.length) {
					return false;
				}
				if (testRunSteps[currentIndex].expectedResult !== step.expectedResult) {
					return false;
				}
				currentIndex++;
				if (!checkStepsRecursive(step.steps)) {
					return false;
				}
			}
			return true;
		};

		for (const testCase of testSuite.testCases) {
			if (!checkStepsRecursive(testCase.steps)) {
				return false;
			}
		}

		return currentIndex === testRunSteps.length;
	}

	private checkActionsMatch(testrun, testSuite: TestSuite): boolean {
		if (!testrun.fields?.testRunSteps) {
			return false;
		}

		const testRunSteps = testrun.fields.testRunSteps;
		let currentIndex = 0;

		const checkStepsRecursive = (steps: any[], description: string, isFirstStepObj: { value: boolean }, localIndex: number): number => {
			if (!steps) {
				return localIndex;
			}

			for (const step of steps) {
				if (localIndex >= testRunSteps.length) {
					return -1; // Signal error: not enough test run steps
				}

				const expectedAction = (description && isFirstStepObj.value ? description : '') + (step.action || '');

				if (isFirstStepObj.value) {
					isFirstStepObj.value = false;
				}

				if (testRunSteps[localIndex].action !== expectedAction) {
					return -1; // Signal error: action mismatch
				}

				localIndex++;
				const nextIndex = checkStepsRecursive(step.steps, description, isFirstStepObj, localIndex);

				if (nextIndex === -1) {
					return -1; // Propagate error
				}
				localIndex = nextIndex;
			}
			return localIndex;
		};

		for (const testCase of testSuite.testCases) {
			const isFirstStepObj = { value: true };
			const nextIndex = checkStepsRecursive(testCase.steps, testCase.description, isFirstStepObj, currentIndex);

			if (nextIndex === -1) {
				return false; // Mismatch found
			}
			currentIndex = nextIndex;
		}

		return currentIndex === testRunSteps.length;
	}

}


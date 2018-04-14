import { TestCase } from './test-case.model';
import { Utilities } from './utilities';

export class TestSuite {
	id: string;
	name: string;
	testCases: TestCase[] = [];

	public addTestCase(test: TestCase) {
		for (let i = 0; i < this.testCases.length; i++) {
			if (this.testCases[i].uuid === test.uuid) {
				this.testCases[i] = test;
				return;
			}
		}
		this.testCases.push(test);
		this.testCases.sort((a, b) => (Utilities.getTmsLink(a) > Utilities.getTmsLink(b) ? -1 : 1))
	}

	public getStatus() {
		if (this.testCases.length === 0) {
			return '';
		}
		for (let i = 0; i < this.testCases.length; i++) {
			if (this.testCases[i].status === 'failed') {
				return 'failed';
			}
		}
		return 'passed';
	}
}

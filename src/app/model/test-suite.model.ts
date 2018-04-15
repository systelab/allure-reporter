import { Label, Step, TestCase } from './test-case.model';
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

	public parseFromDocument(xmlDoc: Document) {

		this.id = xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue;
		this.name = xmlDoc.getElementsByTagName('title')[0].childNodes[0].nodeValue;

		const testcases = xmlDoc.getElementsByTagName('test-cases')[0].getElementsByTagName('test-case');

		for (let i = 0; i < testcases.length; i++) {
			const testcase: TestCase = {
				uuid:        '',
				historyId:   '',
				labels:      [],
				links:       [],
				name:        testcases[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				status:      testcases[i].getAttribute('status'),
				stage:       '',
				description: testcases[i].getElementsByTagName('title')[0].childNodes[0].nodeValue,
				start:       Number(testcases[i].getAttribute('start')),
				stop:        Number(testcases[i].getAttribute('stop')),
				steps:       []
			};

			testcase.steps = this.parseSteps(testcases[i]);
			testcase.labels = this.parseLabels(testcases[i]);

			this.addTestCase(testcase);
		}
	}

	public parseSteps(parent: Element): Step[] {
		const steps: Step[] = [];

		const elementSteps = parent.getElementsByTagName('steps')[0].getElementsByTagName('step');

		for (let j = 0; j < elementSteps.length; j++) {
			const step: Step = {
				name:          elementSteps[j].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				status:        elementSteps[j].getAttribute('status'),
				statusDetails: undefined,
				stage:         '',
				start:         Number(elementSteps[j].getAttribute('start')),
				stop:          Number(elementSteps[j].getAttribute('stop')),
				parameters:    [],
				steps:         []
			};
			if (elementSteps[j].getElementsByTagName('steps').length > 0) {
				step.steps = this.parseSteps(elementSteps[j]);
			}
			steps.push(step);
		}
		return steps;
	}

	public parseLabels(parent: Element): Label[] {
		const labels: Label[] = [];

		const elementLabels = parent.getElementsByTagName('labels')[0].getElementsByTagName('label');

		for (let j = 0; j < elementLabels.length; j++) {
			const label: Label = {
				name:  elementLabels[j].getAttribute('name'),
				value: elementLabels[j].getAttribute('value')
			};
			labels.push(label);
		}
		return labels;
	}
}

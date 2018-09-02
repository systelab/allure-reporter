import { Label, Step, TestCase } from './test-case.model';
import { Utilities } from './utilities';

export class TestSuite {
	id: string;
	name: string;
	testCases: TestCase[] = [];

	constructor(id?: string, name?: string, testCases: TestCase[] = []) {
		this.id = id;
		this.name = name;
		this.testCases = testCases;
	}

	public addTestCase(test: TestCase) {

		const index = this.testCases.findIndex((tc) => tc.uuid === test.uuid);
		if (index !== -1) {
			this.testCases[index] = test;
		} else {
			test.steps = Utilities.followTestCaseStructure(test.steps, 0, true);
			this.testCases.push(test);
			this.testCases.sort((a, b) => (Utilities.getTmsLink(a) > Utilities.getTmsLink(b) ? -1 : 1));
		}
	}

	public getStatus() {
		if (this.testCases.length === 0) {
			return '';
		}
		for (let i = 0; i < this.testCases.length; i++) {
			if (this.testCases[i].status === 'failed') {
				return 'failed';
			}
			if (this.testCases[i].status === 'blocked') {
				return 'blocked';
			}
			if (this.testCases[i].status !== 'passed') {
				return this.testCases[i].status;
			}
		}
		return 'passed';
	}

	public parseFromDocument(xmlDocument: Document) {

		this.id = undefined;
		this.name = undefined;

		const elementTestcases = xmlDocument.getElementsByTagName('test-cases')[0].getElementsByTagName('test-case');

		for (let i = 0; i < elementTestcases.length; i++) {
			const testcase: TestCase = {
				uuid:        elementTestcases[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				historyId:   '',
				labels:      [],
				links:       [],
				name:        elementTestcases[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				status:      elementTestcases[i].getAttribute('status'),
				stage:       '',
				description: elementTestcases[i].getElementsByTagName('title')[0].childNodes[0].nodeValue,
				start:       Number(elementTestcases[i].getAttribute('start')),
				stop:        Number(elementTestcases[i].getAttribute('stop')),
				steps:       []
			};

			testcase.steps = this.parseSteps(elementTestcases[i]);
			testcase.labels = this.parseLabels(elementTestcases[i]);

			for (const label of testcase.labels) {
				if (this.id === undefined && label.name === 'tms') {
					this.id = label.value;
				}
				if (this.name === undefined && label.name === 'feature') {
					this.name = label.value;
				}
			}
			this.addTestCase(testcase);
		}
		if (!this.id) {
			this.id = xmlDocument.getElementsByTagName('name')[0].childNodes[0].nodeValue;
		}
		if (!this.name) {
			this.name = xmlDocument.getElementsByTagName('title')[0].childNodes[0].nodeValue;
		}
	}

	public parseSteps(parent: Element): Step[] {
		const steps: Step[] = [];

		const elementSteps = parent.getElementsByTagName('steps')[0].getElementsByTagName('step');

		for (let i = 0; i < elementSteps.length; i++) {
			const step: Step = {
				      name:           elementSteps[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				      action:         '',
				      expectedResult: '',
				      status:         elementSteps[i].getAttribute('status'),
				      statusDetails:  undefined,
				      stage:          '',
				      start:          Number(elementSteps[i].getAttribute('start')),
				      stop:           Number(elementSteps[i].getAttribute('stop')),
				      parameters:     [],
				      steps:          [],
				      numberOfStep:   '',
				      isAction:       false
			      }
			;
			if (elementSteps[i].getElementsByTagName('steps').length > 0) {
				step.steps = this.parseSteps(elementSteps[i]);
			}
			steps.push(step);
		}
		return steps;
	}

	public parseLabels(parent: Element): Label[] {
		const labels: Label[] = [];

		const elementLabels = parent.getElementsByTagName('labels')[0].getElementsByTagName('label');

		for (let i = 0; i < elementLabels.length; i++) {
			const label: Label = {
				name:  elementLabels[i].getAttribute('name'),
				value: elementLabels[i].getAttribute('value')
			};
			labels.push(label);
		}
		return labels;
	}

	public getTestCasesSummary(): string {
		let data = '<p>Tested actions are:</p>';
		data += '<p>&nbsp;</p>';

		data += '<table border="1" cellpadding="1" cellspacing="1" style="width:100%">';
		data += '<tbody>';

		this.testCases.forEach((tc) => {
			data += '<tr>';
			data += '	<td><strong>' + tc.name + '</strong></td>';
			data += ' <td>' + tc.description + '</td>';
			data += '</tr>';
		});

		data += '</tbody>';
		data += '</table>';

		return data;
	}
}

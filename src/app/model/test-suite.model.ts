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

	public parseFromDocument(xmlDocument: Document) {

		this.id = xmlDocument.getElementsByTagName('name')[0].childNodes[0].nodeValue;
		this.name = xmlDocument.getElementsByTagName('title')[0].childNodes[0].nodeValue;

		const elementTestcases = xmlDocument.getElementsByTagName('test-cases')[0].getElementsByTagName('test-case');

		for (let i = 0; i < elementTestcases.length; i++) {
			const testcase: TestCase = {
				uuid:        '',
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

	public getTestCasesSummary(): string {
		let data = '<p>Tested actions are:</p>';
		data += '<p>&nbsp;</p>';

		data += '		<table border="1" cellpadding="1" cellspacing="1" style="width:100%">';
		data += '			<tbody>';

		for (const tc of this.testCases) {
			data += '<tr>';
			data += '	<td><strong>' + tc.name + '</strong></td>';
			data += ' <td>' + tc.description + '</td>';
			data += '</tr>';
		}
		data += '</tbody>';
		data += '</table>';

		return data;
	}
}

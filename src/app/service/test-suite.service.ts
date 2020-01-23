import { Injectable } from '@angular/core';
import { TestCaseService } from './test-case.service';
import { Label, Step, TestCase, TestSuite } from '../model/allure-test-case.model';

@Injectable({
	providedIn: 'root'
})
export class TestSuiteService {

	constructor(protected testCaseService: TestCaseService) {
	}

	public parseFromDocument(xmlDocument: Document): TestSuite {
		const testSuite = {
			id:        undefined,
			name:      undefined,
			actualResults: undefined,
			testCases: []
		};

		const elementTestcases = xmlDocument.getElementsByTagName('test-cases')[0].getElementsByTagName('test-case');

		for (let i = 0; i < elementTestcases.length; i++) {
			const testCaseStatus = elementTestcases[i].getAttribute('status');
			const testCase: TestCase = {
				uuid:        elementTestcases[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				historyId:   '',
				labels:      this.parseLabels(elementTestcases[i]),
				links:       [],
				name:        elementTestcases[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				status:      testCaseStatus,
				stage:       '',
				description: elementTestcases[i].getElementsByTagName('title')[0].childNodes[0].nodeValue,
				start:       Number(elementTestcases[i].getAttribute('start')),
				stop:        Number(elementTestcases[i].getAttribute('stop')),
				steps:       this.parseSteps(elementTestcases[i], testCaseStatus)
			};

			if (testCase.steps.length === 0) {
				testCase.steps.push(this.createEmptyStep(elementTestcases[i]));
			}

			for (const label of testCase.labels) {
				if (testSuite.id === undefined && label.name === 'tms') {
					testSuite.id = label.value;
				}
				if (testSuite.name === undefined && label.name === 'feature') {
					testSuite.name = label.value;
				}
				if (!testSuite.actualResults && label.name === 'actualResults') {
					testSuite.actualResults = label.value;
				}
			}
			this.addTestCaseToTestSuite(testCase, testSuite);
		}
		if (!testSuite.id) {
			testSuite.id = xmlDocument.getElementsByTagName('name')[0].childNodes[0].nodeValue;
		}
		if (!testSuite.name) {
			testSuite.name = xmlDocument.getElementsByTagName('title')[0].childNodes[0].nodeValue;
		}
		return testSuite;
	}

	private createEmptyStep(testCase): Step {
		const step: Step = {
			name:           '',
			action:         '',
			expectedResult: '',
			status:         testCase.getAttribute('status'),
			statusDetails:  undefined,
			stage:          '',
			start:          Number(testCase.getAttribute('start')),
			stop:           Number(testCase.getAttribute('stop')),
			parameters:     [],
			steps:          [],
			numberOfStep:   '',
			isAction:       true
		};
		return step;
	}

	private queryDirectChildren(parent, selector) {
		const nodes = parent.querySelectorAll(selector);
		const filteredNodes = [].slice.call(nodes)
			.filter(n =>
				n.parentNode.closest(selector) === parent.closest(selector)
			);
		return filteredNodes;
	}

	public getStepStatus(currentStatus: string, testCaseStatus: string): string {
		if ('failed' === testCaseStatus) {
			return testCaseStatus;
		}
		return currentStatus;
	}

	private parseSteps(parent: Element, testCaseStatus: string): Step[] {
		const steps: Step[] = [];
		const elementSteps = this.queryDirectChildren(parent.getElementsByTagName('steps')[0], 'step');
		for (let i = 0; i < elementSteps.length; i++) {
			const step: Step = {
				name:           elementSteps[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				action:         '',
				expectedResult: '',
				status:         this.getStepStatus(elementSteps[i].getAttribute('status'), testCaseStatus),
				statusDetails:  undefined,
				stage:          '',
				start:          Number(elementSteps[i].getAttribute('start')),
				stop:           Number(elementSteps[i].getAttribute('stop')),
				parameters:     [],
				steps:          [],
				numberOfStep:   '',
				isAction:       false
			};
			if (elementSteps[i].getElementsByTagName('steps').length > 0) {
				step.steps = this.parseSteps(elementSteps[i], testCaseStatus);
			}
			steps.push(step);
		}
		return steps;
	}

	private parseLabels(parent: Element): Label[] {
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

	public addTestCaseToTestSuite(testCase: TestCase, testSuite: TestSuite) {

		const index = testSuite.testCases.findIndex((tc) => tc.uuid === testCase.uuid);
		if (index !== -1) {
			testSuite.testCases[index] = testCase;
		} else {
			testCase.steps = this.testCaseService.followTestCaseStructure(testCase.steps, 0, true);
			testSuite.testCases.push(testCase);
			testSuite.testCases.sort((a, b) => (this.testCaseService.getTmsLink(a) > this.testCaseService.getTmsLink(b) ? -1 : 1));
		}
	}

	public getStatus(testSuite: TestSuite) {
		if (testSuite.testCases.length === 0) {
			return '';
		}
		for (let i = 0; i < testSuite.testCases.length; i++) {
			if (testSuite.testCases[i].status === 'failed') {
				return 'failed';
			}
			if (testSuite.testCases[i].status === 'blocked') {
				return 'blocked';
			}
			if (testSuite.testCases[i].status !== 'passed' && testSuite.testCases[i].status !== 'pending') {
				return testSuite.testCases[i].status;
			}
		}
		return 'passed';
	}

	public getActualResults(testSuite: TestSuite, actualResultsFromUI: string) {
		return ['<p>', testSuite.actualResults, '<br />', actualResultsFromUI, '</p>'].join('')
			.replace(/\n/g,  '<br />')
			.replace(/\t/g, '&nbsp;');
	}

	public getTestCasesSummary(testSuite: TestSuite): string {
		let data = '<p>Tested actions are:</p>';
		data += '<p>&nbsp;</p>';

		data += '<table border="1" cellpadding="1" cellspacing="1" style="width:100%">';
		data += '<tbody>';

		testSuite.testCases.forEach((tc) => {
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

import { Injectable } from '@angular/core';
import { TestSuite } from '../model/test-suite.model';
import { Label, Step, TestCase } from '../model/test-case.model';
import { TestCaseService } from './test-case.service';

@Injectable({
	providedIn: 'root'
})
export class TestSuiteService {

	constructor(protected testCaseService: TestCaseService) {
	}

	public parseFromDocument(xmlDocument: Document): TestSuite {
		const testSuite = new TestSuite();
		testSuite.id = undefined;
		testSuite.name = undefined;

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
				if (testSuite.id === undefined && label.name === 'tms') {
					testSuite.id = label.value;
				}
				if (testSuite.name === undefined && label.name === 'feature') {
					testSuite.name = label.value;
				}
			}
			this.addTestCaseToTestSuite(testcase, testSuite);
		}
		if (!testSuite.id) {
			testSuite.id = xmlDocument.getElementsByTagName('name')[0].childNodes[0].nodeValue;
		}
		if (!testSuite.name) {
			testSuite.name = xmlDocument.getElementsByTagName('title')[0].childNodes[0].nodeValue;
		}
		return testSuite;
	}

	private parseSteps(parent: Element): Step[] {
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

	public addTestCaseToTestSuite(test: TestCase, testSuite: TestSuite) {

		const index = testSuite.testCases.findIndex((tc) => tc.uuid === test.uuid);
		if (index !== -1) {
			testSuite.testCases[index] = test;
		} else {
			test.steps = this.testCaseService.followTestCaseStructure(test.steps, 0, true);
			testSuite.testCases.push(test);
			testSuite.testCases.sort((a, b) => (this.testCaseService.getTmsLink(a) > this.testCaseService.getTmsLink(b) ? -1 : 1));
		}
	}
}

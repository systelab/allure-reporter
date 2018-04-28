import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestSuite } from '../../../model/test-suite.model';
import { TestCase } from '../../../model/test-case.model';

export class Element {
	public total = 0;
	public passed = 0;
	public failed = 0;
	public other = 0;

	public constructor(public name: string) {
	}

	public incrementCounters(status) {
		this.total++;
		if (status === 'passed') {
			this.passed++;
		} else if (status === 'failed') {
			this.failed++;
		} else {
			this.other++;
		}
	}

	public getPassedPercentage() {
		return Math.round(this.passed * 100 / this.total) + '%';
	}

	public getFailedPercentage() {
		return Math.round(this.failed * 100 / this.total) + '%';
	}

	public getOtherPercentage() {
		return Math.round(this.other * 100 / this.total) + '%';
	}
}

@Component({
	selector:    'test-summary-table',
	templateUrl: 'test-summary-table.component.html',
	styleUrls:   ['test-summary-table.component.css']

})
export class TestSummaryTableComponent {

	@Input() public category = '';
	@Input() public categoryName = '';

	public elements: Element[] = [];

	public constructor(private ref: ChangeDetectorRef) {
	}

	public setTests(testSuites: TestSuite[]) {
		this.elements = [];
		for (const testSuite of testSuites) {
			for (const testCase of testSuite.testCases) {
				this.createOrUpdateElement(this.getElementName(testCase), testCase.status);
			}
		}
		this.ref.detectChanges();
	}

	private createOrUpdateElement(elementName: string, status: string): void {
		let element = this.getElementByName(elementName);
		if (element) {
			element.incrementCounters(status);
		} else {
			element = new Element(elementName);
			element.incrementCounters(status);
			this.elements.push(element);
		}
	}

	private getElementByName(elementName: string): Element {
		for (const element of this.elements) {
			if (element.name === elementName) {
				return element;
			}
		}
		return undefined;
	}

	private getElementName(test: TestCase): string {
		for (const label of test.labels) {
			if (label.name === this.category) {
				return label.value;
			}
		}
		return '';
	}
}

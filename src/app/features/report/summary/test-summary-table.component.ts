import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestCase, TestSuite } from '../../../model/allure-test-case.model';

export class Element {
	public total = 0;
	public passed = 0;
	public failed = 0;
	public other = 0;
	// new Test Case counters
	public TcTotal = 0;
	public TcPassed = 0;
	public TcFailed = 0;
	public TcOther = 0;

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
		// Test Case counters update
		this.TcTotal = 1;
		this.TcPassed = this.passed === this.total ? 1 : 0;
		this.TcFailed = this.TcPassed === 0 && this.failed > 0 ? 1 : 0;
		this.TcOther = this.TcPassed === 0 && this.TcFailed === 0 && this.other > 0 ? 1 : 0;
	}

	public getPassedPercentage() {
		return this.getPercentage(this.passed);
	}

	public getFailedPercentage() {
		return this.getPercentage(this.failed);
	}

	public getOtherPercentage() {
		return this.getPercentage(this.other);
	}

	private getPercentage(items: number) {
		return Math.round(items * 100 / this.total) + '%';
	}
}

@Component({
    selector: 'test-summary-table',
    templateUrl: 'test-summary-table.component.html',
    styleUrls: ['test-summary-table.component.scss'],
    standalone: false
})
export class TestSummaryTableComponent {

	@Input() public category = '';
	@Input() public categoryName = '';

	public elements: Element[] = [];

	public constructor(private ref: ChangeDetectorRef) {
	}

	public setTests(testSuites: TestSuite[]) {
		this.elements = [];
		testSuites.forEach(ts => {
			ts.testCases.forEach(tc => this.createOrUpdateElement(tc));
		});
		this.ref.detectChanges();
	}

	public getAllPassed() {
		return this.elements.reduce((sum, current) => sum + current.TcPassed, 0);
	}

	public getAllFailed() {
		return this.elements.reduce((sum, current) => sum + current.TcFailed, 0);
	}

	public getAllOther() {
		return this.elements.reduce((sum, current) => sum + current.TcOther, 0);
	}

	public getAllTotal() {
		return this.elements.reduce((sum, current) => sum + current.TcTotal, 0);
	}

	public getAllPassedPercentage() {
		return Math.round(this.getAllPassed() * 10000 / this.getAllTotal()) / 100 + '%';
	}

	public getAllFailedPercentage() {
		return Math.round(this.getAllFailed() * 10000 / this.getAllTotal()) / 100 + '%';
	}

	public getAllOtherPercentage() {
		return Math.round(this.getAllOther() * 10000 / this.getAllTotal()) / 100 + '%';
	}

	private createOrUpdateElement(test: TestCase): void {
		const elementName = this.getElementName(test);

		let element = this.elements.find((e) => e.name === elementName);
		if (!element) {
			element = new Element(elementName);
			this.elements.push(element);
		}
		element.incrementCounters(test.status);
	}

	private getElementName(test: TestCase): string {
		// the file is json -> the Test Case name is in the links array
		const link = test.links.find((l) => l.type === 'tms');
		// the file is xml -> the Test Case name is in the labels array
		const label = test.labels.find((l) => l.name === 'tms');
		return label ? label.value : link.name;
	}
}

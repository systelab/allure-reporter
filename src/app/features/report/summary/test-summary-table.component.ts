import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestCase, TestSuite } from '../../../model/allure-test-case.model';

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
		return this.elements.reduce((sum, current) => sum + current.passed, 0);
	}

	public getAllFailed() {
		return this.elements.reduce((sum, current) => sum + current.failed, 0);
	}

	public getAllOther() {
		return this.elements.reduce((sum, current) => sum + current.other, 0);
	}

	public getAllTotal() {
		return this.elements.reduce((sum, current) => sum + current.total, 0);
	}

	public getAllPassedPercentage() {
		return Math.round(this.getAllPassed() * 100 / this.getAllTotal()) + '%';
	}

	public getAllFailedPercentage() {
		return Math.round(this.getAllFailed() * 100 / this.getAllTotal()) + '%';
	}

	public getAllOtherPercentage() {
		return Math.round(this.getAllOther() * 100 / this.getAllTotal()) + '%';
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
		const label = test.labels.find((l) => l.name === this.category);
		return label ? label.value : '';
	}
}

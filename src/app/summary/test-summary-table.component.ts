import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TestCase } from '../model/model';

export class CategoryTotals {
	public total = 0;
	public passed = 0;
	public failed = 0;
	public other = 0;

	public constructor(public name: string, status: string) {
		this.add(status);
	}

	public add(status) {
		this.total++;
		if (status === 'passed') {
			this.passed++;
		} else if (status === 'failed') {
			this.failed++;
		} else {
			this.other++;
		}
	}

	public getPassed() {
		return Math.round(this.passed * 100 / this.total) + '%';
	}

	public getFailed() {
		return Math.round(this.failed * 100 / this.total) + '%';
	}

	public getOther() {
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

	public categories: CategoryTotals[] = [];

	public constructor(private ref: ChangeDetectorRef) {
	}

	public setTests(tests: TestCase[]) {
		this.categories = [];
		for (let i = 0; i < tests.length; i++) {
			this.addTest(tests[i]);
		}
		this.ref.detectChanges();
	}

	private addTest(test: TestCase) {

		let suite = '';
		let found = false;

		for (let i = 0; i < test.labels.length && suite === ''; i++) {
			if (test.labels[i].name === this.category) {
				suite = test.labels[i].value;
			}
		}
		for (let i = 0; i < this.categories.length; i++) {
			if (this.categories[i].name === suite) {
				this.categories[i].add(test.status);
				found = true;
			}
		}

		if (!found) {
			this.categories.push(new CategoryTotals(suite, test.status))
		}
	}

}

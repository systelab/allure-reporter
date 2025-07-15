import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components';
import { map } from 'rxjs/operators';
import { TestplansService } from '../jama/api/testplans.service';
import { TestCycleData } from '../model/testcycle-data.model';

@Component({
	selector:    'test-cycle-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class TestCycleComboBox extends AbstractApiComboBox<TestCycleData> {

	public totalItems = 0;

	public _testPlan: number;

	set testPlan(value: number) {
		this._testPlan = value;

		this.refresh(null);
	}

	get testPlan() {
		return this._testPlan;
	}

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: TestplansService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new TestCycleData();
	}

	public getDescriptionField(): string {
		return 'name';
	}

	public getCodeField(): string {
		return '';
	}

	public getIdField(): string {
		return 'id';
	}

	public getData(page: number, itemsPerPage: number): Observable<Array<TestCycleData>> {

		if (this.testPlan) {
			return this.api.getTestCycles(this.testPlan, this.getStartAt(page, itemsPerPage), itemsPerPage)
				.pipe(map((value) => {
					this.totalItems = value.meta.pageInfo.totalResults;
					return value.data.map((p) => {
						const testCycleData = new TestCycleData();
						testCycleData.id = p.id;
						testCycleData.name = p.fields.name;
						return testCycleData;
					})
				}));
		} else {
			this.totalItems = 0;
			return of([]);
		}
	}

	public getTotalItems(): number {
		return this.totalItems;
	}

	public getStartAt(page: number, itemsPerPage: number) {
		return (page - 1) * itemsPerPage;
	}

}

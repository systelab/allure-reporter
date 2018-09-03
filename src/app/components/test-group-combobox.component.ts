import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components/widgets/combobox/abstract-api-combobox.component';
import { map } from 'rxjs/internal/operators';
import { TestplansService } from '../jama/api/testplans.service';
import { TestGroupData } from '../model/testgroup-data.model';

@Component({
	selector:    'test-group-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class TestGroupComboBox extends AbstractApiComboBox<TestGroupData> {

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
		return new TestGroupData();
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

	public getData(page: number, itemsPerPage: number): Observable<Array<TestGroupData>> {

		if (this.testPlan) {
			return this.api.getTestGroups(this.testPlan, this.getStartAt(page, itemsPerPage), itemsPerPage)
				.pipe(map((value) => {
					this.totalItems = value.meta.pageInfo.totalResults;
					return value.data.map((p) => {
						const testGroupData = new TestGroupData();
						testGroupData.id = p.id;
						testGroupData.name = p.name;
						return testGroupData;
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

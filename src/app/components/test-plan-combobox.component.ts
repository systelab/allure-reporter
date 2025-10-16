import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components';
import { map } from 'rxjs/operators';
import { TestplansService } from '../jama/api/testplans.service';
import { TestPlanData } from '../model/testplan-data.model';

@Component({
    selector: 'test-plan-combobox',
    templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html',
    standalone: false
})

export class TestPlanComboBox extends AbstractApiComboBox<TestPlanData> {

	public totalItems = 0;

	public _project: number;

	set project(value: number) {
		this._project = value;

		this.refresh(null);
	}

	get project() {
		return this._project;
	}

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: TestplansService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new TestPlanData();
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

	public getData(page: number, itemsPerPage: number): Observable<Array<TestPlanData>> {

		if (this.project) {
			return this.api.getTestPlans(this.project, this.getStartAt(page, itemsPerPage), itemsPerPage)
				.pipe(map((value) => {
					this.totalItems = value.meta.pageInfo.totalResults;
					return value.data.map((p) => {
						const testPlanData = new TestPlanData();
						testPlanData.id = p.id;
						testPlanData.name = p.fields.name;
						return testPlanData;
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

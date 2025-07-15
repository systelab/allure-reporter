import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components';
import { map } from 'rxjs/operators';
import { ReleasesService } from '../jama/api/releases.service';
import { ReleaseData } from '../model/release-data.model';

@Component({
	selector:    'release-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class ReleaseComboBox extends AbstractApiComboBox<ReleaseData> {

	public totalItems = 0;

	public _project: number;

	set project(value: number) {
		this._project = value;

		this.refresh(null);
	}

	get project() {
		return this._project;
	}

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: ReleasesService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new ReleaseData();
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

	public getData(page: number, itemsPerPage: number): Observable<Array<ReleaseData>> {

		if (this.project) {
			return this.api.getReleases(this.project, this.getStartAt(page, itemsPerPage), itemsPerPage)
				.pipe(map((value) => {
					this.totalItems = value.meta.pageInfo.totalResults;
					return value.data.map((p) => {
						const releaseData = new ReleaseData();
						releaseData.id = p.id;
						releaseData.name = p.name;
						return releaseData;
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

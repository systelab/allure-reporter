import { ChangeDetectorRef, Component, Input, Renderer2 } from '@angular/core';
import { ProjectsService } from '../jama/api/projects.service';
import { Observable } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components/widgets/combobox/abstract-api-combobox.component';
import { map } from 'rxjs/internal/operators';
import { ProjectData } from '../model/project-data.model';

@Component({
	selector:    'project-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class ProjectComboBox extends AbstractApiComboBox<ProjectData> {

	public totalItems = 0;

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: ProjectsService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new ProjectData();
	}

	public getDescriptionField(): string {
		return 'name';
	}

	public getCodeField(): string {
		return 'projectKey';
	}

	public getIdField(): string {
		return 'id';
	}

	public getData(page: number, itemsPerPage: number): Observable<Array<ProjectData>> {
		return this.api.getProjects(this.getStartAt(page, itemsPerPage), itemsPerPage)
			.pipe(map((value) => {
				this.totalItems = value.meta.pageInfo.totalResults;
				return value.data.map((p) => {
					const projectData = new ProjectData();
					projectData.id = p.id;
					projectData.projectKey = p.projectKey;
					projectData.name = p.fields.name;
					return projectData;
				})
			}));
	}

	public getTotalItems(): number {
		return this.totalItems;
	}

	public getStartAt(page: number, itemsPerPage: number) {
		return (page - 1) * itemsPerPage;
	}

}

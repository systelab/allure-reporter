import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectsService } from '../../jama';

@Component({
	selector:    'app-report',
	templateUrl: 'report.component.html'
})
export class ReportComponent {

	@Input() public username;
	@Input() public password;
	@Input() public server;

	@Output() public close = new EventEmitter();

	constructor(private projectsService: ProjectsService) {
	}

	public doClose() {
		this.close.emit();
	}

	public doRun() {
		this.projectsService.configuration.username = this.username;
		this.projectsService.configuration.password = this.password;
		this.projectsService.configuration.basePath = this.server;
		this.projectsService.getProject(30)
			.subscribe(
				(wrapper) => {
					console.log(wrapper.data);
				}
			)
	}
}

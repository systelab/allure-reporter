import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectsService, RequestTestCycle } from '../../jama';
import { TestplansService } from '../../jama/api/testplans.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector:    'app-report',
	templateUrl: 'report.component.html'
})
export class ReportComponent {

	@Input() public username;
	@Input() public password;
	@Input() public server;

	@Output() public close = new EventEmitter();

	public project = '';
	public testplan = '';
	public testcycle = '';
	public reporter = '';
	public testgroups = '';

	constructor(private projectsService: ProjectsService, private testplansService: TestplansService) {
	}

	public doClose() {
		this.close.emit();
	}

	public doRun() {
		this.projectsService.configuration.username = this.username;
		this.projectsService.configuration.password = this.password;
		this.projectsService.configuration.basePath = this.server;
		this.projectsService.getProject(Number(this.project))
			.subscribe(
				(wrapper) => {
					console.log(wrapper.data);
					const testGroupsToInclude: Array<number> = [];

					const res = this.testgroups.split(',');
					for (let i = 0; i < res.length; i++) {
						testGroupsToInclude.push(Number(res[i].trim()));
					}
					this.createTestCycle(Number(this.project), Number(this.testplan), this.testcycle, testGroupsToInclude)
						.subscribe(
							(result) => {
								console.log(result);
							}
						)
				}
			)
	}

	private createTestCycle(project: number, testplan: number, testCycleName: string, testGroupsToInclude: Array<number>): Observable<boolean> {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;

		const requestTestCycle: RequestTestCycle = {
			'fields':                  {
				'name':      testCycleName,
				'project':   project,
				'startDate': '2018-01-01',
				'endDate':   '2018-01-15'
			},
			'testRunGenerationConfig': {
				'testGroupsToInclude':      testGroupsToInclude,
				'testRunStatusesToInclude': ['PASSED', 'NOT_RUN', 'INPROGRESS', 'FAILED', 'BLOCKED']
			}
		};

		return this.testplansService.createTestCycle(requestTestCycle, testplan)
			.map(
				(createdResponse) => {
					return createdResponse !== null;
				}
			);
	}

	private getLastTestCycleByTestPlanId(testplan: number): Observable<number> {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;

		return this.testplansService.getTestCycles(testplan)
			.map(
				(value) => {
					if (value.data && value.data.length > 0) {
						return value.data[value.data.length - 1].id;
					}
				}
			)
	}

}

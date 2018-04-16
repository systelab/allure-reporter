import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectsService, RequestTestCycle, RequestTestRun, TestRun, TestRunGenerationConfig, TestrunsService } from '../../jama/index';
import { TestplansService } from '../../jama/api/testplans.service';
import { Observable } from 'rxjs/Observable';
import { format } from 'date-fns'

@Component({
	selector:    'app-reporter',
	templateUrl: 'reporter.component.html'
})
export class ReportComponent {

	@Input() public username;
	@Input() public password;
	@Input() public server;

	@Output() public close = new EventEmitter();

	public project = '';
	public testplan = '';
	public testcycleName = '';
	public reporter = '';
	public testgroups = '';

	constructor(private projectsService: ProjectsService, private testplansService: TestplansService, private testrunsService: TestrunsService) {
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
					this.createTestCycle(Number(this.project), Number(this.testplan), this.testcycleName, testGroupsToInclude)
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

		const startDate: string = format(new Date(), 'YYYY-MM-DD');
		const endDate: string = format(new Date(), 'YYYY-MM-DD');

		const requestTestCycle: RequestTestCycle = {
			'fields':                  {
				'name':      testCycleName,
				'project':   project,
				'startDate': startDate,
				'endDate':   endDate
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
			);
	}

	private getTestRuns(testcycle: number): Observable<Array<TestRun>> {
		this.testrunsService.configuration.username = this.username;
		this.testrunsService.configuration.password = this.password;
		this.testrunsService.configuration.basePath = this.server;

		const list: Array<number> = [];
		list.push(testcycle);
		return this.testrunsService.getTestRuns(list)
			.map((value) => {
				return value.data;
			});
	}

	private setTestRunStatus(testRun: TestRun, status: TestRunGenerationConfig.TestRunStatusesToIncludeEnum): Observable<number> {
		this.testrunsService.configuration.username = this.username;
		this.testrunsService.configuration.password = this.password;
		this.testrunsService.configuration.basePath = this.server;

		const steps: any[] = testRun.fields.testRunSteps;
		for (let i = 0; i < steps.length; i++) {
			steps[i].status = status;
		}

		const body: RequestTestRun = {
			'fields': {
				'testRunSteps': steps
			}
		}
		return this.testrunsService.updateTestRun(body, testRun.id)
			.map((value) => {
				return value.status;
			})
	}

	private setAllTestRunInTheLastCycleOfTheTestPlan(testplan: number, passedTestCase: Array<string>, failedTestCase: Array<string>) {
		this.getLastTestCycleByTestPlanId(testplan)
			.subscribe(
				(lastTestCycle) => {
					this.getTestRuns(lastTestCycle)
						.subscribe(
							(testruns) => {
								for (const testrun of testruns) {
									console.log('Setting Test Case ' + testrun.fields.name);
									if (passedTestCase.indexOf(testrun.fields.name) >= 0) {
										this.setTestRunStatus(testrun, 'PASSED');
									}
									if (failedTestCase.indexOf(testrun.fields.name) >= 0) {
										this.setTestRunStatus(testrun, 'FAILED');
									}
								}
							}
						);
				}
			);
	}
}

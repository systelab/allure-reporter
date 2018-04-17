import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, ProjectsService, RequestTestCycle, RequestTestRun, TestGroup, TestPlan, TestplansService, TestRun, TestRunGenerationConfig, TestrunsService } from '../../jama/index';
import { Observable } from 'rxjs/Observable';
import { format } from 'date-fns'

@Component({
	selector:    'app-reporter',
	templateUrl: 'reporter.component.html'
})
export class ReportComponent implements OnInit {

	@Input() public username;
	@Input() public password;
	@Input() public server;

	@Output() public close = new EventEmitter();

	public _selectedProject: Project;
	public _selectedTestPlan: TestPlan;
	public selectedTestGroup: TestGroup;

	public testcycleName = '';
	public reporter = '';
	public projects: Array<Project> = [];
	public testPlans: Array<TestPlan> = [];
	public testGroups: Array<TestGroup> = [];

	constructor(private projectsService: ProjectsService, private testplansService: TestplansService, private testrunsService: TestrunsService) {
	}

	public get selectedProject(): Project {
		return this._selectedProject;
	}

	public set selectedProject(value: Project) {
		this._selectedProject = value;
		this.selectedTestPlan = undefined;
		this.getTestPlans();
	}

	public get selectedTestPlan(): TestPlan {
		return this._selectedTestPlan;
	}

	public set selectedTestPlan(value: TestPlan) {
		this._selectedTestPlan = value;
		this.selectedTestGroup = undefined;
		this.getTestGroups();
	}

	public ngOnInit() {
		this.getProjects();
	}

	public doClose() {
		this.close.emit();
	}

	public doRun() {
		this.projectsService.configuration.username = this.username;
		this.projectsService.configuration.password = this.password;
		this.projectsService.configuration.basePath = this.server;

		const testGroupsToInclude: Array<number> = [];
		testGroupsToInclude.push(this.selectedTestGroup.id);

		this.createTestCycle(Number(this.selectedProject.id), Number(this.selectedTestPlan.id), this.testcycleName, testGroupsToInclude)
			.subscribe(
				(result) => {
					console.log(result);
				}
			);
	}

	private getProjects() {
		this.projectsService.configuration.username = this.username;
		this.projectsService.configuration.password = this.password;
		this.projectsService.configuration.basePath = this.server;
		this.projectsService.getProjects()
			.subscribe((value) => {
				this.projects = value.data;
			});
	}

	private getTestPlans() {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;
		this.testplansService.getTestPlans(this.selectedProject.id)
			.subscribe((value) => {
				this.testPlans = value.data;
			});
	}

	private getTestGroups() {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;
		this.testplansService.getTestGroups(this.selectedTestPlan.id)
			.subscribe((value) => {
				this.testGroups = value.data;
			});
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
			});
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

import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Project, ProjectsService, RequestTestCycle, RequestTestRun, TestGroup, TestPlan, TestplansService, TestRun, TestRunGenerationConfig, TestrunsService } from '../../jama/index';
import { Observable } from 'rxjs/Observable';
import { format } from 'date-fns'
import { ToastsManager } from 'ng2-toastr';
import { TestSuite } from '../../model/test-suite.model';

@Component({
	selector:    'app-reporter',
	templateUrl: 'reporter.component.html'
})
export class ReportComponent implements OnInit {

	@Input() public username;
	@Input() public password;
	@Input() public server;
	@Input() public testSuites: TestSuite[]
	@Output() public close = new EventEmitter();

	public _selectedProject: Project;
	public _selectedTestPlan: TestPlan;
	public selectedTestGroup: TestGroup;

	public testcycleName = '';
	public projects: Array<Project> = [];
	public testPlans: Array<TestPlan> = [];
	public testGroups: Array<TestGroup> = [];

	constructor(private projectsService: ProjectsService, private testplansService: TestplansService, private testrunsService: TestrunsService,
	            private toastr: ToastsManager, private vcr: ViewContainerRef) {
		this.toastr.setRootViewContainerRef(vcr);
	}

	public get selectedProject(): Project {
		return this._selectedProject;
	}

	public set selectedProject(value: Project) {
		this._selectedProject = value;
		this.selectedTestPlan = undefined;
		this.testPlans = [];
		this.getTestPlans();
	}

	public get selectedTestPlan(): TestPlan {
		return this._selectedTestPlan;
	}

	public set selectedTestPlan(value: TestPlan) {
		this._selectedTestPlan = value;
		this.selectedTestGroup = undefined;
		this.testGroups = [];
		this.getTestGroups();
	}

	public ngOnInit() {
		this.getProjects();
	}

	public doClose() {
		this.close.emit();
	}

	public isValidForm() {
		return this.selectedProject && this.selectedTestPlan && this.selectedTestGroup && this.testcycleName !== '';
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
					if (result) {
						this.toastr.success('Test cycle ' + this.testcycleName + ' created');
						const passedTestCase: Array<string> = [];
						const failedTestCase: Array<string> = [];
						for (const testSuite of this.testSuites) {
							if (testSuite.getStatus() === 'passed') {
								passedTestCase.push(testSuite.id);
							}
							if (testSuite.getStatus() === 'failed') {
								failedTestCase.push(testSuite.id);
							}

						}
						this.setAllTestRunInTheLastCycleOfTheTestPlan(this.selectedTestPlan.id, passedTestCase, failedTestCase);
					}
				},
				(error) => {
					this.toastr.error('Couldn\'t create the test cycle: ' + error.message);
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
			}, (error) => {
				this.toastr.error('Couldn\'t get the project list: ' + error.message);
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
		if (this.selectedTestPlan) {
			this.testplansService.getTestGroups(this.selectedTestPlan.id)
				.subscribe((value) => {
					this.testGroups = value.data;
				});
		} else {
			this.testGroups = undefined;
		}
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
										this.setTestRunStatus(testrun, 'PASSED').subscribe(
											(value) => {
												this.toastr.success('Test run ' + testrun.fields.name + ' Updated');
											}
										);
									}
									if (failedTestCase.indexOf(testrun.fields.name) >= 0) {
										this.setTestRunStatus(testrun, 'FAILED').subscribe(
											(value) => {
												this.toastr.success('Test run ' + testrun.fields.name + ' Updated');
											}
										);
									}
								}
							}
						);
				}
			);
	}
}

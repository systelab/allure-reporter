import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Project, ProjectsService, RequestItemAttachment, RequestTestCycle, RequestTestRun, TestGroup, TestPlan, TestplansService, TestRun, TestrunsService } from '../../jama/index';
import { Observable } from 'rxjs/Observable';
import { format } from 'date-fns'
import { ToastsManager } from 'ng2-toastr';
import { TestSuite } from '../../model/test-suite.model';

export class Action {
	constructor(public id: number, public  text: string) {

	}
}

@Component({
	selector:    'app-reporter',
	templateUrl: 'reporter.component.html'
})
export class ReportComponent implements OnInit {

	@Input() public username;
	@Input() public password;
	@Input() public server;
	@Input() public testSuites: TestSuite[];
	@Output() public close = new EventEmitter();

	public _selectedProject: Project;
	public _selectedTestPlan: TestPlan;
	public selectedTestGroup: TestGroup;
	public selectedAction: Action;

	public testcycleName = '';
	public actions: Array<Action> = [];
	public projects: Array<Project> = [];
	public testPlans: Array<TestPlan> = [];
	public testGroups: Array<TestGroup> = [];

	constructor(private projectsService: ProjectsService, private testplansService: TestplansService, private testrunsService: TestrunsService,
	            private toastr: ToastsManager, private vcr: ViewContainerRef) {
		this.toastr.setRootViewContainerRef(vcr);
		this.actions.push(new Action(1, 'Only set the status. Keep the Test steps.'));
		this.actions.push(new Action(2, 'Copy the steps from the Allure Test Case.'));

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
						this.setAllTestRunInTheLastCycleOfTheTestPlan(this.selectedTestPlan.id, this.testSuites);
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

	private setTestRunStatus(testRun: TestRun, testSuite: TestSuite): Observable<number> {

		this.testrunsService.configuration.username = this.username;
		this.testrunsService.configuration.password = this.password;
		this.testrunsService.configuration.basePath = this.server;

		console.log(testRun.fields);

		let steps: any[] = [];

		if (this.selectedAction.id === 2) {
			for (const tc of testSuite.testCases) {
				const step: any = {};

				step.action = tc.name;
				step.expectedResult = 'Each step meets the expected result';
				step.notes = tc.description;
				if (testSuite.getStatus() === 'passed') {
					step.status = 'PASSED';
				}
				if (testSuite.getStatus() === 'failed') {
					step.status = 'FAILED';
				}
				steps.push(step);
			}
		} else {
			steps = testRun.fields.testRunSteps;
			for (let i = 0; i < steps.length; i++) {
				console.log(steps);
				if (testSuite.getStatus() === 'passed') {
					steps[i].status = 'PASSED';
				}
				if (testSuite.getStatus() === 'failed') {
					steps[i].status = 'FAILED';
				}
			}
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

	private getTestSuite(id: string, testSuites: TestSuite[]): TestSuite {
		for (const testsuite of testSuites) {
			if (testsuite.id === id) {
				return testsuite;
			}
		}
		return undefined;
	}

	private setAllTestRunInTheLastCycleOfTheTestPlan(testplan: number, testSuites: TestSuite[]) {
		this.getLastTestCycleByTestPlanId(testplan)
			.subscribe(
				(lastTestCycle) => {
					this.getTestRuns(lastTestCycle)
						.subscribe(
							(testruns) => {
								for (const testrun of testruns) {
									console.log('Setting Test Case ' + testrun.fields.name);

									const testSuite = this.getTestSuite(testrun.fields.name, testSuites);
									if (testSuite) {
										if (testSuite.getStatus() === 'passed' || testSuite.getStatus() === 'failed') {
											this.setTestRunStatus(testrun, testSuite)
												.subscribe(
													(value) => {
														this.toastr.success('Test run ' + testrun.fields.name + ' Updated as ' + testSuite.getStatus());
													}
												);
										}
									}
								}
							}
						);
				}
			);
	}
}

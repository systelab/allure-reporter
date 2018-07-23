import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, ProjectsService, RequestTestCycle, RequestTestRun, TestCycle, TestGroup, TestPlan, TestplansService, TestRun, TestrunsService, UsersService } from '../../jama/index';
import { Observable } from 'rxjs';
import { format } from 'date-fns'
import { TestSuite } from '../../model/test-suite.model';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

	private _userId;
	private _selectedProject: Project;
	private _selectedTestPlan: TestPlan;
	public selectedTestGroup: TestGroup;
	public selectedTestCycle: TestCycle;

	public nameForNewTestCycle = '';
	public actions: Array<Action> = [];
	public projects: Array<Project> = [];
	public testPlans: Array<TestPlan> = [];
	public testGroups: Array<TestGroup> = [];
	public testCycles: Array<TestCycle> = [];

	constructor(private usersService: UsersService, private projectsService: ProjectsService, private testplansService: TestplansService, private testrunsService: TestrunsService,
	            private toastr: ToastrService) {
	}

	public ngOnInit() {
		this.usersService.configuration.username = this.username;
		this.usersService.configuration.password = this.password;
		this.usersService.configuration.basePath = this.server;
		if (this.username && this.password && this.server) {
			this.usersService.getCurrentUser()
				.subscribe((user) => {
					this._userId = user.data.id;
					this.getProjects();
				}, (error) => {
					this.toastr.error('Couldn\'t get the username: ' + this.username);
				});
		}
	}

	public get selectedProject(): Project {
		return this._selectedProject;
	}

	public set selectedProject(value: Project) {
		this._selectedProject = value;
		this.selectedTestPlan = undefined;
		this.selectedTestCycle = undefined;
		this.testPlans = [];
		this.getTestPlans();
	}

	public get selectedTestPlan(): TestPlan {
		return this._selectedTestPlan;
	}

	public set selectedTestPlan(value: TestPlan) {
		this._selectedTestPlan = value;
		this.selectedTestGroup = undefined;
		this.selectedTestCycle = undefined;
		this.testGroups = [];
		this.getTestGroups();
		this.testCycles = [];
		this.getTestCycles();
	}

	public doClose() {
		this.close.emit();
	}

	public isValidForm() {
		if (this._userId) {
			if (this.selectedTestCycle) {
				return true;
			} else {
				return this.selectedProject && this.selectedTestPlan && this.selectedTestGroup && this.nameForNewTestCycle !== '';
			}
		} else {
			return false;
		}
	}

	public doRun() {

		this.projectsService.configuration.username = this.username;
		this.projectsService.configuration.password = this.password;
		this.projectsService.configuration.basePath = this.server;

		if (this.selectedTestCycle !== undefined) {
			this.updateTestRunInTheTestCycle(this.selectedTestCycle.id, this.testSuites, this._userId);
		} else {

			const testGroupsToInclude: Array<number> = [];
			testGroupsToInclude.push(this.selectedTestGroup.id);

			this.createTestCycle(Number(this.selectedProject.id), Number(this.selectedTestPlan.id), this.nameForNewTestCycle, testGroupsToInclude)
				.subscribe((result) => {
						if (result) {
							this.toastr.success('Test cycle ' + this.nameForNewTestCycle + ' created');
							this.updateTestRunInTheLastCycleOfTheTestPlan(this.selectedTestPlan.id, this.testSuites, this._userId);
						}
					}, (error) => {
						this.toastr.error('Couldn\'t create the test cycle: ' + error.message);
					}
				);
		}
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

	private getTestCycles() {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;
		if (this.selectedTestPlan) {
			this.testplansService.getTestCycles(this.selectedTestPlan.id)
				.subscribe((value) => {
					this.testCycles = value.data;
				});
		} else {
			this.testCycles = undefined;
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
			.pipe(
				map(
					(createdResponse) => {
						return createdResponse !== null;
					}
				));
	}

	private getLastTestCycleByTestPlanId(testplan: number): Observable<number> {
		this.testplansService.configuration.username = this.username;
		this.testplansService.configuration.password = this.password;
		this.testplansService.configuration.basePath = this.server;

		return this.testplansService.getTestCycles(testplan)
			.pipe(
				map(
					(value) => {
						if (value.data && value.data.length > 0) {
							return value.data[value.data.length - 1].id;
						}
					}
				));
	}

	private getTestRuns(testcycle: number): Observable<Array<TestRun>> {
		this.testrunsService.configuration.username = this.username;
		this.testrunsService.configuration.password = this.password;
		this.testrunsService.configuration.basePath = this.server;

		const list: Array<number> = [];
		list.push(testcycle);
		return this.testrunsService.getTestRuns(list)
			.pipe(
				map((value) => {
					return value.data;
				}));
	}

	private setTestRunStatus(testRun: TestRun, testSuite: TestSuite, userId: number): Observable<number> {

		this.testrunsService.configuration.username = this.username;
		this.testrunsService.configuration.password = this.password;
		this.testrunsService.configuration.basePath = this.server;

		console.log(testRun.fields);

		const steps = testRun.fields.testRunSteps;
		for (let i = 0; i < steps.length; i++) {
			console.log(steps);
			switch (testSuite.getStatus()) {
				case 'passed':
					steps[i].status = 'PASSED';
					break;
				case 'failed':
					steps[i].status = 'FAILED';
					break;
				case 'blocked':
					steps[i].status = 'BLOCKED';
			}
		}

		const summary = testSuite.getTestCasesSummary();

		const body: RequestTestRun = {
			'fields': {
				'testRunSteps':  steps,
				'actualResults': summary,
				'assignedTo':    userId
			}
		}
		return this.testrunsService.updateTestRun(body, testRun.id)
			.pipe(
				map((value) => {
					return value.status;
				}));
	}

	private getTestSuite(id: string, testSuites: TestSuite[]): TestSuite {
		for (const testsuite of testSuites) {
			if (testsuite.id === id) {
				return testsuite;
			}
		}
		return undefined;
	}

	private updateTestRunInTheLastCycleOfTheTestPlan(testplan: number, testSuites: TestSuite[], userId: number) {
		this.getLastTestCycleByTestPlanId(testplan)
			.subscribe(
				(lastTestCycle) => {
					this.updateTestRunInTheTestCycle(lastTestCycle, testSuites, userId);
				}
			);
	}

	private updateTestRunInTheTestCycle(testCycleId, testSuites: TestSuite[], userId: number) {
		this.getTestRuns(testCycleId)
			.subscribe((testruns) => {
					for (const testrun of testruns) {
						console.log('Setting Test Case ' + testrun.fields.name);
						const testSuite = this.getTestSuite(testrun.fields.name, testSuites);
						if (testSuite) {
							switch (testSuite.getStatus()) {
								case 'passed':
								case 'failed':
								case 'blocked':
									this.setTestRunStatus(testrun, testSuite, userId)
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
}

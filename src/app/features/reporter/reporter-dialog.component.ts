import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { TestSuite } from '../../model/test-suite.model';
import { ProjectsService, RequestTestCycle, RequestTestRun, TestplansService, TestRun, TestrunsService, UsersService } from '../../jama';
import { ToastrService } from 'ngx-toastr';
import { ProjectComboBox } from '../../components/project-combobox.component';
import { TestPlanComboBox } from '../../components/test-plan-combobox.component';
import { TestGroupComboBox } from '../../components/test-group-combobox.component';
import { TestCycleComboBox } from '../../components/test-cycle-combobox.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/index';
import { format } from "date-fns";

export class ReporterDialogParameters extends SystelabModalContext {
	public width = 550;
	public height = 300;
	public username;
	public password;
	public server;
	public testSuites: TestSuite[];
}

@Component({
	selector:    'reporter-dialog',
	templateUrl: 'reporter-dialog.component.html',
})
export class ReporterDialog implements ModalComponent<ReporterDialogParameters>, OnInit {

	@ViewChild('projectComboBox') public projectComboBox: ProjectComboBox;
	@ViewChild('testPlanComboBox') public testPlanComboBox: TestPlanComboBox;
	@ViewChild('testCycleComboBox') public testCycleComboBox: TestCycleComboBox;
	@ViewChild('testGroupComboBox') public testGroupComboBox: TestGroupComboBox;

	public parameters: ReporterDialogParameters;

	private _userId;

	private _selectedProjectId: number;
	public selectedProjectName: string;

	private _selectedTestPlanId: number;
	public selectedTestPlanName: string;

	private _selectedTestCycleId: number;
	public selectedTestCycleName = 'New Test Cycle';

	private _selectedTestGroupId: number;
	public selectedTestGroupName: string;

	public nameForNewTestCycle = '';

	public newTestCycle = true;

	constructor(public dialog: DialogRef<ReporterDialogParameters>, private usersService: UsersService, private projectsService: ProjectsService,
	            private testplansService: TestplansService, private testrunsService: TestrunsService, private toastr: ToastrService) {
		this.parameters = dialog.context;
	}

	public ngOnInit() {
		this.usersService.configuration.username = this.parameters.username;
		this.usersService.configuration.password = this.parameters.password;
		this.usersService.configuration.basePath = this.parameters.server;

		this.projectsService.configuration.username = this.parameters.username;
		this.projectsService.configuration.password = this.parameters.password;
		this.projectsService.configuration.basePath = this.parameters.server;

		this.testplansService.configuration.username = this.parameters.username;
		this.testplansService.configuration.password = this.parameters.password;
		this.testplansService.configuration.basePath = this.parameters.server;

		this.testrunsService.configuration.username = this.parameters.username;
		this.testrunsService.configuration.password = this.parameters.password;
		this.testrunsService.configuration.basePath = this.parameters.server;

		if (this.parameters.username && this.parameters.password && this.parameters.server) {
			this.usersService.getCurrentUser()
				.subscribe((user) => {
					this._userId = user.data.id;
				}, (error) => {
					this.toastr.error('Couldn\'t get the username: ' + this.parameters.username);
				});
		}
	}

	public isValidForm() {
		if (this._userId) {
			if (this.selectedTestCycleId) {
				return true;
			} else {
				return this.selectedProjectId && this.selectedTestPlanId && this.selectedTestGroupId && this.nameForNewTestCycle !== '';
			}
		} else {
			return false;
		}
	}

	public get selectedProjectId(): number {
		return this._selectedProjectId;
	}

	public set selectedProjectId(value: number) {
		this._selectedProjectId = value;
		this.selectedTestPlanId = undefined;
		this.selectedTestPlanName = undefined;
		this.testPlanComboBox.project = value;
	}

	public get selectedTestPlanId(): number {
		return this._selectedTestPlanId;
	}

	public set selectedTestPlanId(value: number) {
		this._selectedTestPlanId = value;
		this.selectedTestGroupId = undefined;
		this.selectedTestGroupName = undefined;
		this.selectedTestCycleId = undefined;
		this.selectedTestCycleName = 'New Test Cycle';
		this.testCycleComboBox.testPlan = value;
		this.testGroupComboBox.testPlan = value;
	}

	public get selectedTestCycleId(): number {
		return this._selectedTestCycleId;
	}

	public set selectedTestCycleId(value: number) {
		this._selectedTestCycleId = value;
	}

	public get selectedTestGroupId(): number {
		return this._selectedTestGroupId;
	}

	public set selectedTestGroupId(value: number) {
		this._selectedTestGroupId = value;
	}

	public static getParameters(): ReporterDialogParameters {
		return new ReporterDialogParameters();
	}

	public close(): void {
		this.dialog.close(false);
	}

	public doRun() {

		if (this.selectedTestCycleId !== undefined) {
			this.updateTestRunInTheTestCycle(this.selectedTestCycleId, this.parameters.testSuites, this._userId);
		} else {

			const testGroupsToInclude: Array<number> = [];
			testGroupsToInclude.push(this.selectedTestGroupId);

			this.createTestCycle(Number(this.selectedProjectId), Number(this.selectedTestPlanId), this.nameForNewTestCycle, testGroupsToInclude)
				.subscribe((result) => {
						if (result) {
							this.toastr.success('Test cycle ' + this.nameForNewTestCycle + ' created');
							this.updateTestRunInTheLastCycleOfTheTestPlan(this.selectedTestPlanId, this.parameters.testSuites, this._userId);
						}
					}, (error) => {
						this.toastr.error('Couldn\'t create the test cycle: ' + error.message);
					}
				);
		}
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

	private getTestRuns(testcycle: number): Observable<Array<TestRun>> {
		const list: Array<number> = [];
		list.push(testcycle);
		return this.testrunsService.getTestRuns(list)
			.pipe(
				map((value) => {
					return value.data;
				}));
	}

	private setTestRunStatus(testRun: TestRun, testSuite: TestSuite, userId: number): Observable<number> {

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

	private createTestCycle(project: number, testplan: number, testCycleName: string, testGroupsToInclude: Array<number>): Observable<boolean> {

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

	private updateTestRunInTheLastCycleOfTheTestPlan(testplan: number, testSuites: TestSuite[], userId: number) {
		this.getLastTestCycleByTestPlanId(testplan)
			.subscribe(
				(lastTestCycle) => {
					this.updateTestRunInTheTestCycle(lastTestCycle, testSuites, userId);
				}
			);
	}

	private getLastTestCycleByTestPlanId(testplan: number): Observable<number> {

		return this.testplansService.getTestCycles(testplan, 0, 50)
			.pipe(
				map(
					(value) => {
						if (value.data && value.data.length > 0) {
							return value.data[value.data.length - 1].id;
						}
					}
				));
	}
}
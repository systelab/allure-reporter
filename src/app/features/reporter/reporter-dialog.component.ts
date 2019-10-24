import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { ProjectsService, RequestTestCycle, RequestTestRun, TestplansService, TestRun, TestrunsService, UsersService, ItemsService } from '../../jama';
import { ToastrService } from 'ngx-toastr';
import { ProjectComboBox } from '../../components/project-combobox.component';
import { TestPlanComboBox } from '../../components/test-plan-combobox.component';
import { TestGroupComboBox } from '../../components/test-group-combobox.component';
import { TestCycleComboBox } from '../../components/test-cycle-combobox.component';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs/index';
import { format } from 'date-fns';
import { TestSuiteService } from '../../service/test-suite.service';
import { TestSuite } from '../../model/allure-test-case.model';

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

	public selectedTestGroups?: Array<any> = [];

	public nameForNewTestCycle = '';

	constructor(public dialog: DialogRef<ReporterDialogParameters>, private usersService: UsersService, private projectsService: ProjectsService,
	            private testplansService: TestplansService, private testrunsService: TestrunsService,
	            private testSuiteService: TestSuiteService, private toastr: ToastrService, private itemsService: ItemsService) {
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

		this.itemsService.configuration.username = this.parameters.username;
		this.itemsService.configuration.password = this.parameters.password;
		this.itemsService.configuration.basePath = this.parameters.server;

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
				return this.selectedProjectId && this.selectedTestPlanId && this.selectedTestGroups.length > 0 && this.nameForNewTestCycle !== '';
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
		this.selectedTestGroups = [];
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

	public static getParameters(): ReporterDialogParameters {
		return new ReporterDialogParameters();
	}

	public close(): void {
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close(false);
	}

	public doRun() {

		if (this.selectedTestCycleId !== undefined) {
			this.updateTestRunsInTheTestCycle(this.selectedTestCycleId, this.parameters.testSuites, this._userId);
		} else {

			const testGroupsToInclude: Array<number> = this.selectedTestGroups.map((a) => a.id);

			this.createTestCycle(Number(this.selectedProjectId), Number(this.selectedTestPlanId), this.nameForNewTestCycle, testGroupsToInclude)
				.subscribe((result) => {
						if (result) {
							this.toastr.success('Test cycle ' + this.nameForNewTestCycle + ' created');
							this.updateTestRunsInTheLastCycleOfTheTestPlan(this.selectedTestPlanId, this.parameters.testSuites, this._userId);
						}
					}, (error) => {
						this.toastr.error('Couldn\'t create the test cycle: ' + error.message);
					}
				);
		}
	}

	private updateTestRunsInTheTestCycle(testCycleId, testSuites: TestSuite[], userId: number) {
		this.getTestRuns(testCycleId)
			.subscribe((testruns) => {
					testruns.forEach(testrun => {
							const documentKey = this.getKeyById(testrun.fields.testCase).subscribe(
								key => {
									const testSuite = testSuites.find(ts => ts.id === key || ts.id === testrun.fields.name);
									this.updateTestRunForTestCase(testSuite, testrun, userId);
								});
					});
				}
			);
	}

	private updateTestRunForTestCase(testSuite, testrun, userId: number) {
		if (testSuite) {
			this.setTestRunStatus(testrun, testSuite, userId)
				.subscribe(
					(value) => {
						this.toastr.success('Test run ' + testrun.fields.name + ' Updated as ' + this.testSuiteService.getStatus(testSuite));
					}, (error) => {
						this.toastr.error('Test run ' + testrun.fields.name + ' Not updated');
					}
				);
		}
	}

	private getKeyById(testCaseId: number): Observable<string> {
		return this.itemsService.getItem(testCaseId)
			.pipe(map(value => {
				return value.data.documentKey;
			}));
	}

	private getTestRuns(testCycleId: number): Observable<Array<TestRun>> {
		const list: Array<number> = [];
		list.push(testCycleId);
		return this.testrunsService.getTestRuns(list)
			.pipe(map(value => {
				return value.data;
			}));
	}

	private setTestRunStatus(testRun: TestRun, testSuite: TestSuite, userId: number): Observable<number> {

		let status;

		switch (this.testSuiteService.getStatus(testSuite)) {
			case 'passed':
				status = 'PASSED';
				break;
			case 'blocked':
				status = 'BLOCKED';
				break;
			case 'failed':
				status = 'FAILED';
				break;
		}

		if (status) {
			const body: RequestTestRun = {
				'fields': {
					'testRunSteps':  testRun.fields.testRunSteps.map(s => {
						s.status = status;
						return s;
					}),
					'actualResults': this.testSuiteService.getTestCasesSummary(testSuite),
					'assignedTo':    userId
				}
			};
			return this.testrunsService.updateTestRun(body, testRun.id)
				.pipe(map((value) => {
					return value.status;
				}));
		} else {
			throwError('Status not supported!');
		}
	}

	private createTestCycle(project: number, testPlanId: number, testCycleName: string, testGroupsToInclude: Array<number>): Observable<boolean> {

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

		return this.testplansService.createTestCycle(requestTestCycle, testPlanId)
			.pipe(map((createdResponse) => {
					return createdResponse !== null;
				}
			));
	}

	private updateTestRunsInTheLastCycleOfTheTestPlan(testPlanId: number, testSuites: TestSuite[], userId: number) {
		this.getLastTestCycleByTestPlanId(testPlanId)
			.subscribe(
				(lastTestCycle) => {
					this.updateTestRunsInTheTestCycle(lastTestCycle, testSuites, userId);
				}
			);
	}

	private getLastTestCycleByTestPlanId(testPlanId: number): Observable<number> {
		return this.testplansService.getTestCycles(testPlanId, 0, 50)
			.pipe(map((value) => {
					if (value.data && value.data.length > 0) {
						return value.data[value.data.length - 1].id;
					}
				}
			));
	}
}

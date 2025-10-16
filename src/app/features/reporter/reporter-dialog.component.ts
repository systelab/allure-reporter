import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogHeaderComponent, DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components';
import { ProjectsService, RequestTestCycle, RequestTestRun, TestplansService, TestRun, TestrunsService, UsersService, ItemsService, TestRunDataListWrapper, AbstractitemsService, RequestItem, RequestPatchOperation, ItemDataWrapper, ReleasesService } from '../../jama';
import { ToastrService } from 'ngx-toastr';
import { ProjectComboBox } from '../../components/project-combobox.component';
import { TestPlanComboBox } from '../../components/test-plan-combobox.component';
import { TestGroupComboBox } from '../../components/test-group-combobox.component';
import { TestCycleComboBox } from '../../components/test-cycle-combobox.component';
import { ReleaseComboBox } from '../../components/release-combobox.component';
import { Observable, range, throwError, forkJoin } from 'rxjs';
import { concatMap, map,  takeWhile, mergeMap, tap} from 'rxjs/operators';
import { format } from 'date-fns';
import { TestSuiteService } from '../../service/test-suite.service';
import { TestSuite } from '../../model/allure-test-case.model';

export class ReporterDialogParameters extends SystelabModalContext {
	public width = 900;
	public height = 650;
	public username;
	public password;
	public server;
	public testSuites: TestSuite[];
}

enum ResultStatus {
	Passed = 'passed',
	Failed = 'failed',
	Blocked = 'blocked',
	NotUpdated = 'NotUpdated',
	FileNotInJama = 'FileNotInJama'
}

@Component({
    selector: 'reporter-dialog',
    templateUrl: 'reporter-dialog.component.html',
    styleUrls: ['reporter-dialog.component.scss'],
    standalone: false
})
export class ReporterDialog implements ModalComponent<ReporterDialogParameters>, OnInit {

	@ViewChild('projectComboBox') public projectComboBox: ProjectComboBox;
	@ViewChild('testPlanComboBox') public testPlanComboBox: TestPlanComboBox;
	@ViewChild('testCycleComboBox') public testCycleComboBox: TestCycleComboBox;
	@ViewChild('testGroupComboBox') public testGroupComboBox: TestGroupComboBox;
	@ViewChild('releaseComboBox') public releaseComboBox: ReleaseComboBox;
	@ViewChild('header') header: DialogHeaderComponent;

	public parameters: ReporterDialogParameters;

	private _userId;

	private _selectedProjectId: number;
	public selectedProjectName: string;

	private _selectedTestPlanId: number;
	public selectedTestPlanName: string;

	private _selectedTestCycleId: number;
	public selectedTestCycleName = 'New Test Cycle';

	private _selectedReleaseId: number;
	public selectedReleaseName: string;

	public updateTestCaseVersion : boolean = false;

	public selectedTestGroups?: Array<any> = [];

	public nameForNewTestCycle = '';
	public actualResults = '';

	public totalTestsRun = 0;
	public totalSuites = 0;
	public currentTestsRun = 0;
	public testsRun = {
		[ResultStatus.Passed]: 0,
		[ResultStatus.Failed]: 0,
		[ResultStatus.NotUpdated]: 0,
		[ResultStatus.FileNotInJama]: 0
	};

	public testsUpload = {
		[ResultStatus.Passed]: [],
		[ResultStatus.Failed]: [],
		[ResultStatus.NotUpdated]: [],
		[ResultStatus.FileNotInJama]: []
	};

	public uploading = false;
	public onlyUpdateTestCase = false;

	public testsRunPercentage = 0;

	constructor(public dialog: DialogRef<ReporterDialogParameters>, private usersService: UsersService, private projectsService: ProjectsService,
							private releasesService : ReleasesService,
							private testplansService: TestplansService, private testrunsService: TestrunsService,
							private testSuiteService: TestSuiteService, private toastr: ToastrService, private itemsService: ItemsService,
							private abstractItemService: AbstractitemsService) {
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

		this.releasesService.configuration.username = this.parameters.username;
		this.releasesService.configuration.password = this.parameters.password;
		this.releasesService.configuration.basePath = this.parameters.server;

		this.abstractItemService.configuration.username = this.parameters.username;
		this.abstractItemService.configuration.password = this.parameters.password;
		this.abstractItemService.configuration.basePath = this.parameters.server;

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
		return this._userId && this.selectedProjectId && this.selectedTestPlanId &&
			(this.selectedTestCycleId || (this.selectedTestGroups.length > 0 && this.nameForNewTestCycle !== ''));
	}

	public get selectedProjectId(): number {
		return this._selectedProjectId;
	}

	public set selectedProjectId(value: number) {
		this._selectedProjectId = value;
		this.selectedTestPlanId = undefined;
		this.selectedTestPlanName = undefined;
		this.testPlanComboBox.project = value;
		this.releaseComboBox.project = value;
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

	public set selectedReleaseId(value: number) {
		this._selectedReleaseId = value;
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

	public doUpdateTestCase() {
			const testCaseItemType = [26, 59]; // 26 - Test Case CSW ; 59 - Test Case IL
			this.uploading = true;
			this.onlyUpdateTestCase = true;
			this.initTests(null, this.parameters.testSuites.length);
			this.parameters.testSuites.forEach((suite) => {
				this.abstractItemService.getAbstractItems([Number(this.selectedProjectId)], testCaseItemType, undefined,
					undefined, undefined, undefined, undefined, [suite.id],
					['createdDate.asc'], 0, 1)
						.pipe(mergeMap((value) => {
							if (value.data.length > 0) {
								const itemIDTestCase = value.data[0].id;
								this.saveResultTest(ResultStatus.Passed, suite.id);
								return this.patchTestCase(suite, itemIDTestCase);
							} else {
								this.saveResultTest(ResultStatus.FileNotInJama, suite.id);
								return new Observable();
							}
						}
					)).subscribe((success) =>{
						this.toastr.success('Test cases description and steps updated');
						this.uploading = false;
					}, (error) =>
					{
						this.toastr.error('Couldn\'t update the test cases: ' + error.message);
						this.uploading = false;
					});
				});
	}


	private patchTestCase(suite: TestSuite, itemIDTestCase: number): Observable<any> {
		var updateDescription: RequestPatchOperation = {
			op: "replace",
			path: "/fields/description",
			value: this.testSuiteService.getDescription(suite.name)
		};

		var updateSteps: RequestPatchOperation = {
			op: "replace",
			path: "/fields/testCaseSteps",
			value: this.testSuiteService.getTestCaseStepsToUpdate(suite)
		};

		return this.itemsService.patchItem([updateSteps, updateDescription], itemIDTestCase);
	}

	public doRun() {
		this.uploading = true;
		this.onlyUpdateTestCase = false;
		if (this.selectedTestCycleId !== undefined) {
			this.updateTestRunsInTheTestCycle(this.selectedTestCycleId, this.parameters.testSuites, this._userId, this.actualResults, this._selectedReleaseId);
		} else {

			const testGroupsToInclude: Array<number> = this.selectedTestGroups.map((a) => a.id);

			this.createTestCycle(Number(this.selectedProjectId), Number(this.selectedTestPlanId), this.nameForNewTestCycle, testGroupsToInclude)
				.subscribe((result) => {
						if (result) {
							this.toastr.success('Test cycle ' + this.nameForNewTestCycle + ' created');
							this.updateTestRunsInTheLastCycleOfTheTestPlan(this.selectedTestPlanId, this.parameters.testSuites, this._userId, this.actualResults, this._selectedReleaseId);
						}
					}, (error) => {
						this.uploading = false;
						this.toastr.error('Couldn\'t create the test cycle: ' + error.message);
					}
				);
		}
	}

	public areResultsReady() {
		return this.currentTestsRun === this.totalTestsRun && this.totalTestsRun > 0;
	}

	public areResultsWrong() {
		return this.testsUpload[ResultStatus.NotUpdated].length > 0 || this.testsUpload[ResultStatus.FileNotInJama].length > 0;
	}

	private updateTestRunsInTheTestCycle(testCycleId, testSuites: TestSuite[], userId: number, actualResults: string, executedInVersion?: number) {
		this.getTestRuns(testCycleId).subscribe((tests) => {
			if (tests.pageInfo.startIndex === 0) {
					this.initTests(tests.totalResults, testSuites.length);
					this.testsUpload[ResultStatus.FileNotInJama] = testSuites.map(ts => ts.id);
			}
			tests.testruns.forEach(testrun => {
				this.getKeyById(testrun.fields.testCase).subscribe(
					key => {
								const testSuite = testSuites.find(ts => ts.id === key || ts.id === testrun.fields.name);
								if (testSuite) {
									this.testsUpload[ResultStatus.FileNotInJama].splice(this.testsUpload[ResultStatus.FileNotInJama].indexOf(testSuite.id), 1);
									this.updateTestRunForTestCase(testSuite, testrun, userId, actualResults, executedInVersion);
								} else {
									this.saveResultTest(ResultStatus.FileNotInJama, testrun.fields.name);
								}
							});
					});
				}
		);
	}

	private updateTestRunForTestCase(testSuite, testrun, userId: number, actualResults: string, executedInVersion?: number) {
		this.setTestRunStatus(testrun, testSuite, userId, actualResults, executedInVersion)
			.subscribe(
				(value) => {
					if(executedInVersion)
					{
						this.setExecutedInVersion(testrun, executedInVersion, this.updateTestCaseVersion);
					}

					this.saveResultTest(this.testSuiteService.getStatus(testSuite) as ResultStatus, testrun.fields.name);
				}, (error) => {
					this.saveResultTest(ResultStatus.NotUpdated, testrun.fields.name);
				}
			);

	}

	private setExecutedInVersion(testrun: TestRun, executedInVersion: number, updateTestCaseVersion: boolean){
		var updateExecutedInVersion: RequestPatchOperation = {
			op: "add",
			path: "/fields/tested_in_version$37",
			value: executedInVersion
		};

		this.testrunsService.patchTestRun([updateExecutedInVersion], testrun.id).subscribe();

		if(updateTestCaseVersion) {
			var updateTestCaseLastTestedVersion: RequestPatchOperation = {
				op: "add",
				path: "/fields/last_tested_version$26",
				value: executedInVersion
			};
			this.itemsService.patchItem([updateTestCaseLastTestedVersion], testrun.fields["testCase"]).subscribe();
		}
	}

	private saveResultTest(status: ResultStatus, name: string) {
		this.testsRun[status]++;
		this.currentTestsRun++;

		this.testsRunPercentage = 100 * this.currentTestsRun / this.totalTestsRun;
		this.header.go(this.testsRunPercentage);

		if (status !== ResultStatus.Blocked && status !== ResultStatus.FileNotInJama) {
			this.testsUpload[status].push(name);
		}

		if (this.areResultsReady()) {
			this.uploading = false;
		}
	}

	private initTests(totalTests: number, totalSuites: number) {
		this.totalTestsRun = totalTests || totalSuites;
		this.totalSuites = totalSuites;
		this.currentTestsRun = 0;

		Object.keys(this.testsRun).forEach(testRun => this.testsRun[testRun] = 0);
		Object.keys(this.testsUpload).forEach(testWrong => this.testsUpload[testWrong] = []);
	}

	private getKeyById(testCaseId: number): Observable<string> {
		return this.itemsService.getItem(testCaseId)
			.pipe(map(value => {
				return value.data.documentKey;
			}));
	}

	private getTestRuns(testCycleId: number) {
		const list: Array<number> = [];
		list.push(testCycleId);
		const itemsPerPage = 20;
		return range(0, 100)
			.pipe(
				concatMap(currentIndex  => this.testrunsService.getTestRuns(list, undefined, undefined, undefined, currentIndex * itemsPerPage, itemsPerPage)),
				takeWhile( (value: TestRunDataListWrapper) => value && value.data && value.data.length > 0),
				map( value => {
					return {
						testruns: value.data,
						totalResults: value.meta.pageInfo.totalResults,
						pageInfo: value.meta.pageInfo
					};
				}));
	}

	private setTestRunStatus(testRun: TestRun, testSuite: TestSuite, userId: number, actualResults, executedInVersion?: number): Observable<number> {

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
					'actualResults': this.testSuiteService.getActualResults(testSuite, actualResults),
					'assignedTo':    userId,
					'tested_version$37' : executedInVersion
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

	private updateTestRunsInTheLastCycleOfTheTestPlan(testPlanId: number, testSuites: TestSuite[], userId: number, actualResults: string, executedInVersion?: number) {
		this.getLastTestCycleByTestPlanId(testPlanId)
			.subscribe(
				(lastTestCycle) => {
					this.updateTestRunsInTheTestCycle(lastTestCycle, testSuites, userId, actualResults, executedInVersion);
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

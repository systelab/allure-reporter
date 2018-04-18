import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { TestSummaryTableComponent } from './features/report/summary/test-summary-table.component';
import { ProjectsService } from './jama/api/projects.service';
import { TestSuite } from './model/test-suite.model';
import { TestCase } from './model/test-case.model';
import { Utilities } from './model/utilities';

@Component({
	selector:    'app-root',
	templateUrl: 'app.component.html',
	styleUrls:   ['app.component.css']
})
export class AppComponent {

	@ViewChildren(TestSummaryTableComponent) public summaryList: QueryList<TestSummaryTableComponent>;

	public testSuites: TestSuite[] = [];

	public uploadingFiles: string[] = [];

	public showUser = false;
	public showReport = false;

	public username = '';
	public password = '';
	public server = 'https://jama.systelab.net/contour/rest/latest';

	private _showSummary = true;
	get showSummary(): boolean {
		return this._showSummary;
	}

	set showSummary(show: boolean) {
		this._showSummary = show;
		this.update();
	}

	private _showResults = true;
	get showResults(): boolean {
		return this._showResults;
	}

	set showResults(show: boolean) {
		this._showResults = show;
		this.update();
	}

	constructor(private http: HttpClient, private ref: ChangeDetectorRef, private projects: ProjectsService) {
	}

	public fileDrop(event: UploadEvent) {

		const files: UploadFile[] = event.files;

		for (const file of files) {
			file.fileEntry.file(info => {
				this.uploadingFiles.push(info.name);

				const reader = new FileReader();
				reader.onload = (e: any) => {
					if (info.name.endsWith('.json')) {
						const test: TestCase = JSON.parse(e.target.result);
						this.addTest(test);
					} else {
						if (info.name.endsWith('.xml')) {
							const parser: DOMParser = new DOMParser();
							const xmlDoc: Document = parser.parseFromString(e.target.result, 'text/xml');
							const newTestSuite = new TestSuite();
							newTestSuite.parseFromDocument(xmlDoc);
							this.addTestSuite(newTestSuite);
						}
					}
				};
				reader.onloadend = (e: any) => {
					for (let i = this.uploadingFiles.length - 1; i >= 0; i--) {
						if (this.uploadingFiles[i] === info.name) {
							this.uploadingFiles.splice(i, 1);
						}
					}
					this.update();
				}
				reader.readAsText(info);
			});
		}
	}

	public update() {
		this.ref.detectChanges();
		const summaries: TestSummaryTableComponent[] = this.summaryList.toArray();
		for (const summary of summaries) {
			summary.setTests(this.testSuites);
		}
	}

	private addTest(test: TestCase) {
		const testSuiteId = Utilities.getTmsLink(test);
		const testSuiteName = Utilities.getTmsDescription(test);

		if (test.steps.length === 0) {
			return;
		}
		for (let i = 0; i < this.testSuites.length; i++) {
			if (this.testSuites[i].id === testSuiteId) {
				this.testSuites[i].addTestCase(test);
				return;
			}
		}
		const newTestSuite = new TestSuite(testSuiteId, testSuiteName);
		newTestSuite.addTestCase(test);
		this.addTestSuite(newTestSuite);
	}

	private addTestSuite(testsuite: TestSuite) {
		if (testsuite.id) {
			for (let i = 0; i < this.testSuites.length; i++) {
				if (this.testSuites[i].id === testsuite.id) {
					for (let j = 0; j < testsuite.testCases.length; j++) {
						this.testSuites[i].addTestCase(testsuite.testCases[j]);
					}
					return;
				}
			}
			this.testSuites.push(testsuite);
			this.testSuites.sort((a, b) => (a.id > b.id ? -1 : 1))
		}
	}

	public getDateDetails(test: TestCase) {
		return Utilities.getDateDetails(test);
	}

	public doShowUser(show: boolean) {
		this.showUser = show;
	}

	public doShowReport(show: boolean) {
		this.showReport = show;
	}
}

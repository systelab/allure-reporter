import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestCase } from './model/model';
import { UploadEvent, UploadFile } from 'ngx-file-drop';
import { TestSummaryTableComponent } from './features/summary/test-summary-table.component';

@Component({
	selector:    'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {

	@ViewChildren(TestSummaryTableComponent) public summaryList: QueryList<TestSummaryTableComponent>;

	public tests: TestCase[] = [];

	public uploadingFiles: string[] = [];

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

	constructor(private http: HttpClient, private ref: ChangeDetectorRef) {
	}

	public fileDrop(event: UploadEvent) {

		const files: UploadFile[] = event.files;

		for (const file of files) {
			file.fileEntry.file(info => {
				this.uploadingFiles.push(info.name);

				const reader = new FileReader();
				reader.onload = (e: any) => {
					const test: TestCase = JSON.parse(e.target.result);
					this.addTest(test);
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
			summary.setTests(this.tests);
		}
	}

	private addTest(test: TestCase) {
		if (test.steps.length === 0) {
			return;
		}
		for (let i = 0; i < this.tests.length; i++) {
			if (this.tests[i].uuid === test.uuid) {
				this.tests[i] = test;
				return;
			}
		}
		this.tests.push(test);
	}

	public getDateDetails(test: TestCase) {
		if (test) {
			const date = new Date();
			date.setTime(test.start);
			const duration = test.stop - test.start;
			return this.formatDate(date) + '    (Duration ' + duration + ' ms)';
		}
		return '-';
	}

	private formatDate(date: Date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		let sMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
		let strTime = hours + ':' + sMinutes + ' ' + ampm;
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
	}

}

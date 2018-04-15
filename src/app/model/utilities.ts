import { Step, TestCase } from './test-case.model';
import { TestSuite } from './test-suite.model';

export class Utilities {

	public static getTmsLink(test: TestCase): string {
		for (const link of test.links) {
			if (link.type === 'tms') {
				return link.name;
			}
		}
		return '';
	}

	public static getTmsDescription(test: TestCase): string {
		for (const label of test.labels) {
			if (label.name === 'feature') {
				return label.value;
			}
		}
		return '';
	}

	public static getDateDetails(test: TestCase) {
		const date = new Date();
		date.setTime(test.start);
		const duration = test.stop - test.start;
		return this.formatDate(date) + '    (Duration ' + duration + ' ms)';
	}

	private static formatDate(date: Date) {
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const sMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
		const strTime = hours + ':' + sMinutes + ' ' + ampm;
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
	}

}

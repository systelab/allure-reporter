import { TestCase } from './test-case.model';

export class TestSuite {
	id: string;
	name: string;
	testCases: TestCase[] = [];

	constructor(id?: string, name?: string, testCases: TestCase[] = []) {
		this.id = id;
		this.name = name;
		this.testCases = testCases;
	}

	public getStatus() {
		if (this.testCases.length === 0) {
			return '';
		}
		for (let i = 0; i < this.testCases.length; i++) {
			if (this.testCases[i].status === 'failed') {
				return 'failed';
			}
			if (this.testCases[i].status === 'blocked') {
				return 'blocked';
			}
			if (this.testCases[i].status !== 'passed') {
				return this.testCases[i].status;
			}
		}
		return 'passed';
	}

	public getTestCasesSummary(): string {
		let data = '<p>Tested actions are:</p>';
		data += '<p>&nbsp;</p>';

		data += '<table border="1" cellpadding="1" cellspacing="1" style="width:100%">';
		data += '<tbody>';

		this.testCases.forEach((tc) => {
			data += '<tr>';
			data += '	<td><strong>' + tc.name + '</strong></td>';
			data += ' <td>' + tc.description + '</td>';
			data += '</tr>';
		});

		data += '</tbody>';
		data += '</table>';

		return data;
	}
}

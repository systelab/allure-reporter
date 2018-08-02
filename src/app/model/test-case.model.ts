export interface TestCase {
	uuid: string;
	historyId: string;
	labels: Label[];
	links: Link[];
	name: string;
	status: string;
	stage: string;
	description: string;
	start: number;
	stop: number;
	steps: Step[];
}

export interface Label {
	name: string;
	value: string;
}

export interface Link {
	name: string;
	url: string;
	type: string;
}

export interface StatusDetails {
	known: boolean;
	muted: boolean;
	flaky: boolean;
	message: string;
	trace: string;
}

export interface Parameter {
	name: string;
	value: string;
}

export interface Step {
	name: string;
	status: string;
	statusDetails: StatusDetails;
	stage: string;
	start: any;
	stop: any;
	parameters: Parameter[];
	steps: Step[];
	numberOfStep: any;
}




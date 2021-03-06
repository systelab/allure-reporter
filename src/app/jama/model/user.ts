/**
 * Jama REST API
 * This is the documentation for the Jama REST API.
 *
 * OpenAPI spec version: latest
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface User {
	id: number;

	username: string;

	firstName: string;

	lastName: string;

	email: string;

	phone: string;

	title: string;

	location: string;

	licenseType: User.LicenseTypeEnum;

	avatarUrl: string;

	active: boolean;

}

export namespace User {
	export type LicenseTypeEnum =
		'NAMED'
		| 'FLOATING'
		| 'STAKEHOLDER'
		| 'FLOATING_COLLABORATOR'
		| 'RESERVED_COLLABORATOR'
		| 'FLOATING_REVIEWER'
		| 'RESERVED_REVIEWER'
		| 'NAMED_REVIEWER'
		| 'TEST_RUNNER'
		| 'EXPIRING_TRIAL'
		| 'INACTIVE';
}



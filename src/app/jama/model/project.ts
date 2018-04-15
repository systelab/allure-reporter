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

export interface Project {
	id: number;

	projectKey: string;

	/**
	 * ID of a project
	 */
	parent: number;

	isFolder: boolean;

	createdDate: Date;

	modifiedDate: Date;

	/**
	 * ID of a user
	 */
	createdBy: number;

	/**
	 * ID of a user
	 */
	modifiedBy: number;

	fields: { [key: string]: any; };

}


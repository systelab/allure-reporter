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

import { FilterQuery } from './filterQuery';

export interface Filter {
	id: number;

	name: string;

	/**
	 * ID of a user
	 */
	author: number;

	projectScope: Filter.ProjectScopeEnum;

	/**
	 * ID of a project
	 */
	specifiedProject: number;

	filterQuery: FilterQuery;

	public: boolean;

}

export namespace Filter {
	export type ProjectScopeEnum = 'ALL' | 'CURRENT' | 'SPECIFIED';
}


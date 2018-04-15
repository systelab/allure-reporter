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

/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import '../rxjs-operators';

import { FilterDataListWrapper } from '../model/filterDataListWrapper';
import { FilterDataWrapper } from '../model/filterDataWrapper';
import { ItemDataListWrapper } from '../model/itemDataListWrapper';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class FiltersService {

	protected basePath = 'https://jama.systelab.net/contour/rest/latest';
	public defaultHeaders = new HttpHeaders();
	public configuration = new Configuration();

	constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
		if (basePath) {
			this.basePath = basePath;
		}
		if (configuration) {
			this.configuration = configuration;
			this.basePath = basePath || configuration.basePath || this.basePath;
		}
	}

	/**
	 * @param consumes string[] mime-types
	 * @return true: consumes contains 'multipart/form-data', false: otherwise
	 */
	private canConsumeForm(consumes: string[]): boolean {
		const form = 'multipart/form-data';
		for (let consume of consumes) {
			if (form === consume) {
				return true;
			}
		}
		return false;
	}

	public isJsonMime(mime: string): boolean {
		const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
		return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
	}

	/**
	 * Get the filter with the specified ID
	 *
	 * @param id
	 * @param include Links to include as full objects in the linked map
	 */
	public getFilter(id: number, include?: Array<string>): Observable<FilterDataWrapper> {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling getFilter.');
		}

		let queryParameters = new HttpParams();
		if (include) {
			include.forEach((element) => {
				queryParameters = queryParameters.append('include', <any>element);
			})
		}

		let headers = this.defaultHeaders;

		// authentication (basic) required
		if (this.configuration.username || this.configuration.password) {
			headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
		}

		// authentication (oauth2) required
		if (this.configuration.accessToken) {
			let accessToken = typeof this.configuration.accessToken === 'function'
				? this.configuration.accessToken()
				: this.configuration.accessToken;
			headers = headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return this.httpClient.get<any>(`${this.basePath}/filters/${encodeURIComponent(String(id))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all filters in the project with the specified ID viewable by the current user
	 *
	 * @param project
	 * @param author
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getFilters(project: number, author?: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<FilterDataListWrapper> {
		if (project === null || project === undefined) {
			throw new Error('Required parameter project was null or undefined when calling getFilters.');
		}

		let queryParameters = new HttpParams();
		if (project !== undefined) {
			queryParameters = queryParameters.set('project', <any>project);
		}
		if (author !== undefined) {
			queryParameters = queryParameters.set('author', <any>author);
		}
		if (startAt !== undefined) {
			queryParameters = queryParameters.set('startAt', <any>startAt);
		}
		if (maxResults !== undefined) {
			queryParameters = queryParameters.set('maxResults', <any>maxResults);
		}
		if (include) {
			include.forEach((element) => {
				queryParameters = queryParameters.append('include', <any>element);
			})
		}

		let headers = this.defaultHeaders;

		// authentication (basic) required
		if (this.configuration.username || this.configuration.password) {
			headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
		}

		// authentication (oauth2) required
		if (this.configuration.accessToken) {
			let accessToken = typeof this.configuration.accessToken === 'function'
				? this.configuration.accessToken()
				: this.configuration.accessToken;
			headers = headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return this.httpClient.get<any>(`${this.basePath}/filters`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all result items for the filter with the specified ID
	 *
	 * @param id
	 * @param project
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getResults(id: number, project?: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<ItemDataListWrapper> {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling getResults.');
		}

		let queryParameters = new HttpParams();
		if (project !== undefined) {
			queryParameters = queryParameters.set('project', <any>project);
		}
		if (startAt !== undefined) {
			queryParameters = queryParameters.set('startAt', <any>startAt);
		}
		if (maxResults !== undefined) {
			queryParameters = queryParameters.set('maxResults', <any>maxResults);
		}
		if (include) {
			include.forEach((element) => {
				queryParameters = queryParameters.append('include', <any>element);
			})
		}

		let headers = this.defaultHeaders;

		// authentication (basic) required
		if (this.configuration.username || this.configuration.password) {
			headers = headers.set('Authorization', 'Basic ' + btoa(this.configuration.username + ':' + this.configuration.password));
		}

		// authentication (oauth2) required
		if (this.configuration.accessToken) {
			let accessToken = typeof this.configuration.accessToken === 'function'
				? this.configuration.accessToken()
				: this.configuration.accessToken;
			headers = headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return this.httpClient.get<any>(`${this.basePath}/filters/${encodeURIComponent(String(id))}/results`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}
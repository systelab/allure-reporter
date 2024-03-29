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

import { Observable } from 'rxjs';
import '../rxjs-operators';

import { AbstractRestResponse } from '../model/abstractRestResponse';
import { CreatedResponse } from '../model/createdResponse';
import { ItemDataListWrapper } from '../model/itemDataListWrapper';
import { RequestTag } from '../model/requestTag';
import { TagDataListWrapper } from '../model/tagDataListWrapper';
import { TagDataWrapper } from '../model/tagDataWrapper';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class TagsService {

	protected basePath = '';
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
	 * Create a new tag in the project with the specified ID
	 *
	 * @param body
	 */
	public addTagToProject(body: RequestTag): Observable<CreatedResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling addTagToProject.');
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

		return this.httpClient.post<any>(`${this.configuration.basePath}/tags`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Delete the tag with the specified ID
	 *
	 * @param id
	 */
	public deleteTag(id: number): Observable<AbstractRestResponse> {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling deleteTag.');
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

		return this.httpClient.delete<any>(`${this.configuration.basePath}/tags/${encodeURIComponent(String(id))}`, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all items that have the tag with the specified ID
	 *
	 * @param id
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getItemsUsingTag(id: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<ItemDataListWrapper> {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling getItemsUsingTag.');
		}

		let queryParameters = new HttpParams();
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

		return this.httpClient.get<any>(`${this.configuration.basePath}/tags/${encodeURIComponent(String(id))}/items`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get the tag with the specified ID
	 *
	 * @param id
	 * @param include Links to include as full objects in the linked map
	 */
	public getTag(id: number, include?: Array<string>): Observable<TagDataWrapper> {
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling getTag.');
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

		return this.httpClient.get<any>(`${this.configuration.basePath}/tags/${encodeURIComponent(String(id))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all tags for the project with the specified ID
	 *
	 * @param project
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getTagsInProject(project: number, startAt?: number, maxResults?: number, include?: Array<string>): Observable<TagDataListWrapper> {
		if (project === null || project === undefined) {
			throw new Error('Required parameter project was null or undefined when calling getTagsInProject.');
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

		return this.httpClient.get<any>(`${this.configuration.basePath}/tags`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Update the tag with the specified ID
	 *
	 * @param body
	 * @param id
	 */
	public putTag(body: RequestTag, id: number): Observable<AbstractRestResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling putTag.');
		}
		if (id === null || id === undefined) {
			throw new Error('Required parameter id was null or undefined when calling putTag.');
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

		return this.httpClient.put<any>(`${this.configuration.basePath}/tags/${encodeURIComponent(String(id))}`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}

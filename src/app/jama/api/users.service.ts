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
import { FilterDataListWrapper } from '../model/filterDataListWrapper';
import { RequestActiveStatus } from '../model/requestActiveStatus';
import { RequestUser } from '../model/requestUser';
import { UserDataListWrapper } from '../model/userDataListWrapper';
import { UserDataWrapper } from '../model/userDataWrapper';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class UsersService {

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
	 * Create a new user
	 *
	 * @param body
	 */
	public addUser(body: RequestUser): Observable<CreatedResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling addUser.');
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

		return this.httpClient.post<any>(`${this.configuration.basePath}/users`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Gets the current user
	 *
	 * @param include Links to include as full objects in the linked map
	 */
	public getCurrentUser(include?: Array<string>): Observable<UserDataWrapper> {

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
		return this.httpClient.get<any>(`${this.configuration.basePath}/users/current`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Gets the current user&#39;s favorite filters
	 *
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getFavoriteFiltersForCurrentUser(startAt?: number, maxResults?: number, include?: Array<string>): Observable<FilterDataListWrapper> {

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

		return this.httpClient.get<any>(`${this.configuration.basePath}/users/current/favoritefilters`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get the user with the specified ID
	 *
	 * @param userId
	 * @param include Links to include as full objects in the linked map
	 */
	public getUser(userId: number, include?: Array<string>): Observable<UserDataWrapper> {
		if (userId === null || userId === undefined) {
			throw new Error('Required parameter userId was null or undefined when calling getUser.');
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

		return this.httpClient.get<any>(`${this.configuration.basePath}/users/${encodeURIComponent(String(userId))}`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Get all users
	 *
	 * @param username
	 * @param email
	 * @param firstName
	 * @param lastName
	 * @param includeInactive
	 * @param startAt
	 * @param maxResults If not set, this defaults to 20. This cannot be larger than 50
	 * @param include Links to include as full objects in the linked map
	 */
	public getUsers(username?: string, email?: string, firstName?: string, lastName?: string, includeInactive?: boolean, startAt?: number, maxResults?: number, include?: Array<string>): Observable<UserDataListWrapper> {

		let queryParameters = new HttpParams();
		if (username !== undefined) {
			queryParameters = queryParameters.set('username', <any>username);
		}
		if (email !== undefined) {
			queryParameters = queryParameters.set('email', <any>email);
		}
		if (firstName !== undefined) {
			queryParameters = queryParameters.set('firstName', <any>firstName);
		}
		if (lastName !== undefined) {
			queryParameters = queryParameters.set('lastName', <any>lastName);
		}
		if (includeInactive !== undefined) {
			queryParameters = queryParameters.set('includeInactive', <any>includeInactive);
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

		return this.httpClient.get<any>(`${this.configuration.basePath}/users`, {
			params:          queryParameters,
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Update the user with the specified ID
	 *
	 * @param body
	 * @param userId
	 */
	public putUser(body: RequestUser, userId: number): Observable<AbstractRestResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling putUser.');
		}
		if (userId === null || userId === undefined) {
			throw new Error('Required parameter userId was null or undefined when calling putUser.');
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

		return this.httpClient.put<any>(`${this.configuration.basePath}/users/${encodeURIComponent(String(userId))}`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

	/**
	 * Update the active status for the user with the specified ID
	 *
	 * @param body
	 * @param userId
	 */
	public setActiveStatus(body: RequestActiveStatus, userId: number): Observable<AbstractRestResponse> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling setActiveStatus.');
		}
		if (userId === null || userId === undefined) {
			throw new Error('Required parameter userId was null or undefined when calling setActiveStatus.');
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

		return this.httpClient.put<any>(`${this.configuration.basePath}/users/${encodeURIComponent(String(userId))}/active`, body, {
			headers:         headers,
			withCredentials: this.configuration.withCredentials,
		});
	}

}

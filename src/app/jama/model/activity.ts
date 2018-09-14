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

export interface Activity {
	id: number;

	date: Date;

	details: string;

	action: string;

	/**
	 * ID of a user
	 */
	user: number;

	userComment: string;

	/**
	 * ID of an item
	 */
	item: number;

	eventType: Activity.EventTypeEnum;

	objectType: Activity.ObjectTypeEnum;

}

export namespace Activity {
	export type EventTypeEnum =
		'CREATE'
		| 'BATCH_CREATE'
		| 'UPDATE'
		| 'BATCH_UPDATE'
		| 'DELETE'
		| 'BATCH_DELETE'
		| 'PUBLIC'
		| 'BATCH_SUMMARY'
		| 'COPY'
		| 'BATCH_COPY'
		| 'MOVE';
	export type ObjectTypeEnum =
		'PROJECT'
		| 'ITEM'
		| 'USER'
		| 'RELATIONSHIP'
		| 'COMMENT'
		| 'ITEM_TAG'
		| 'TAG'
		| 'ITEM_ATTACHMENT'
		| 'URL'
		| 'TEST_RESULT'
		| 'BASELINE'
		| 'CHANGE_REQUEST'
		| 'REVIEW'
		| 'REVISION'
		| 'REVISION_ITEM'
		| 'TEST_PLAN'
		| 'TEST_CYCLE'
		| 'TEST_RUN'
		| 'INTEGRATION'
		| 'MISCELLANEOUS';
}



import { Injectable } from '@angular/core';

@Injectable()
export class HTMLUtilService {
	public static entityMap: any = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#39;',
		'/': '&#x2F;'
	};

	public static escapeHtml(source: string): string {
		return String(source)
			.replace(/[&<>"'\/]/g, s => HTMLUtilService.entityMap[s]);
	}
}

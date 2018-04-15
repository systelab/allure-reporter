import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';
import { TestLabelComponent } from './features/labels/test-label.component';
import { MarkdownModule } from 'ngx-markdown';
import { TestStepsComponent } from './features/steps/test-steps.component';
import { TestSummaryTableComponent } from './features/summary/test-summary-table.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { TestLinkComponent } from './features/links/test-link.component';
import { ApiModule } from './jama/index';
import { LoginComponent } from './common/login/login.component';
import { ReportComponent } from './common/report/report.component';
import { FormsModule } from '@angular/forms';

/*
export function apiConfig() {
	return new Configuration({
		username: 'username',
		password: 'password',
		basePath: 'https://XXXXX/contour/rest/latest',
		withCredentials: true
	});
}
*/
@NgModule({
	imports:      [
		FormsModule,
		ApiModule,
		BrowserModule,
		HttpClientModule,
		FileDropModule,
		MarkdownModule.forRoot()
	],
	declarations: [
		AppComponent,
		TestLabelComponent,
		TestLinkComponent,
		TestStepsComponent,
		TestSummaryTableComponent,
		NavbarComponent,
		FooterComponent,
		LoginComponent,
		ReportComponent
	],
	providers:    [],
	bootstrap:    [AppComponent]
})
export class AppModule {
}

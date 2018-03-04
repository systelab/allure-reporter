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

@NgModule({
	declarations: [
		AppComponent,
		TestLabelComponent,
		TestLinkComponent,
		TestStepsComponent,
		TestSummaryTableComponent,
		NavbarComponent,
		FooterComponent
	],
	imports:      [
		BrowserModule,
		HttpClientModule,
		FileDropModule,
		MarkdownModule.forRoot()
	],
	providers:    [],
	bootstrap:    [AppComponent]
})
export class AppModule {
}

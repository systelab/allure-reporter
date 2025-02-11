import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';
import { TestLabelComponent } from './features/report/labels/test-label.component';
import { MarkdownModule } from 'ngx-markdown';
import { TestStepsComponent } from './features/report/steps/test-steps.component';
import { TestSummaryTableComponent } from './features/report/summary/test-summary-table.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { TestLinkComponent } from './features/report/links/test-link.component';
import { ApiModule } from './jama/index';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TestCycleComboBox } from './components/test-cycle-combobox.component';
import { TestPlanComboBox } from './components/test-plan-combobox.component';
import { ProjectComboBox } from './components/project-combobox.component';
import { ReleaseComboBox } from './components/release-combobox.component';
import { ReporterDialog } from './features/reporter/reporter-dialog.component';
import { LoginDialog } from './features/login/login-dialog.component';
import { TestGroupComboBox } from './components/test-group-combobox.component';
import { SystelabComponentsModule } from 'systelab-components';
import { SystelabPreferencesModule } from 'systelab-preferences';
import { SystelabTranslateModule } from 'systelab-translate';
import { GridHeaderContextMenuComponent } from 'systelab-components/widgets/grid/contextmenu/grid-header-context-menu.component';
import { DialogService, MessagePopupService } from 'systelab-components/widgets/modal';
import { HelpComponent } from './features/help/help.component';
import { GridContextMenuCellRendererComponent } from 'systelab-components/widgets/grid/contextmenu/grid-context-menu-cell-renderer.component';

@NgModule({
	imports:      [
		FormsModule,
		ApiModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FileDropModule,
		SystelabPreferencesModule.forRoot(),
		SystelabComponentsModule.forRoot(),
		SystelabTranslateModule.forRoot(),
		AgGridModule.withComponents([
			GridContextMenuCellRendererComponent,
			GridHeaderContextMenuComponent
		]),
		ToastrModule.forRoot(),
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
		LoginDialog,
		ReporterDialog,
		HelpComponent,
		ProjectComboBox,
		ReleaseComboBox,
		TestPlanComboBox,
		TestCycleComboBox,
		TestGroupComboBox
	],
	providers:    [
		MessagePopupService,
		DialogService
	],
	bootstrap:    [AppComponent]
})
export class AppModule {
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';
import { TestLabelComponent } from './test-label.component';
import { MarkdownModule } from 'ngx-markdown';
import { TestStepsComponent } from './test-steps.component';

@NgModule({
  declarations: [
    AppComponent,
    TestLabelComponent,
    TestStepsComponent
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

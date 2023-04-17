import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { AppComponent } from './app.component';
import { CodeCellComponent } from './code-cell/code-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    CodeCellComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

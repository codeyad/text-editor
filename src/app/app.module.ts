import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TextEditorModule } from 'text-editor'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TextEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { TextEditorComponent } from './text-editor.component';
import { FormControl, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TextEditorComponent
  ],
  imports: [
    FormsModule
  ],
  providers: [
    FormControl
  ],
  exports: [
    TextEditorComponent
  ]
})
export class TextEditorModule { }

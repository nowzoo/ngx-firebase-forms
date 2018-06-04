import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DemoFormBuilderComponent } from './demo-form-builder/demo-form-builder.component';
import { DemoFormControlComponent } from './demo-form-control/demo-form-control.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoFormBuilderComponent,
    DemoFormControlComponent,

  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

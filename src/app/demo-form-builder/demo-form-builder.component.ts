import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { Reference } from '@firebase/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxFirebaseFormBuilder } from '@nowzoo/ngx-firebase-forms';

@Component({
  selector: 'app-demo-form-builder',
  templateUrl: './demo-form-builder.component.html',
  styleUrls: ['./demo-form-builder.component.css']
})
export class DemoFormBuilderComponent implements OnInit {
  fg: FormGroup;
  constructor(
    private afDb: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.fg = NgxFirebaseFormBuilder.group(
      // the parent ref...
      this.afDb.database.ref('some/path/to/the/parent/object') as Reference,
      // A map of NgxFirebaseGroupConfigEntry...
      {
        name: {updateOn: 'blur', trim: true, validators: [Validators.required]},
        age: {updateOn: 'blur', validators: [Validators.min(0)]},
        gender: null
      }
    );
  }
}

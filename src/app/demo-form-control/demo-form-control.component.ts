import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Reference } from '@firebase/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxFirebaseControl, NgxFirebaseControlOptions } from '@nowzoo/ngx-firebase-forms';

@Component({
  selector: 'app-demo-form-control',
  templateUrl: './demo-form-control.component.html',
  styleUrls: ['./demo-form-control.component.css']
})
export class DemoFormControlComponent implements OnInit {

  control: NgxFirebaseControl;
  constructor(
    private afDb: AngularFireDatabase
  ) {}
  ngOnInit() {
    // Note the library does not depend on angularfire2. You can get a firebase ref however you wish.
    const ref = this.afDb.database.ref(`foo/bar`) as Reference;
    const options: NgxFirebaseControlOptions = {
      ref: ref,
      updateOn: 'blur',
      trim: true,
      validators: [Validators.required]
    };
    this.control = new NgxFirebaseControl(options);
    // the control is automatically populated with the database value,
    // and changes to its value are automatically saved (if the control is valid)
  }
}

# NgxFirebaseForms

Angular FormControl extended and bound to a Firebase reference.

## Quick Start

```bash
npm i @nowzoo/ngx-firebase-forms
```

This library consists of a couple of classes: `NgxFirebaseControl` which extends Angular's `FormControl` and `NgxFirebaseFormBuilder`, which has a static helper method to create a `FormGroup` of `NgxFirebaseControl`'s.  
In additions there a re a couple of interfaces. **There is no module.**

Note that the examples below use [AngularFireDatabase from angularfire2](https://github.com/angular/angularfire2) to convenintly create Firebase references, but you can use whatever method you want. The library is not dependent on angularfire2.

### Using `new NgxFirebaseControl`
Create a control that is automatically populated from the database, and whose value, if valid, is automatically saved to the database.
```ts
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
  }
}
```

### Using `NgxFirebaseFormBuilder`

`NgxFirebaseFormBuilder.group()` is a static method that creates a FormGroup of `NgxFirebaseControl` controls. You pass it the parent reference and a map of control definitions.
```ts
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
```

# NgxFirebaseForms

Angular FormControl extended and bound to a Firebase reference.

## Quick Start

```bash
npm i @nowzoo/ngx-firebase-forms
```

This library consists of a couple of classes: `NgxFirebaseControl` which extends Angular's `FormControl` and `NgxFirebaseFormBuilder`, which has a static helper method to create a `FormGroup` of `NgxFirebaseControl`'s.  
In additions there a re a couple of interfaces. **There is no module.**

Using `new NgxFirebaseControl` to create a single control:
```ts
import { Validators } from '@angular/forms';
import { Reference } from '@firebase/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxFirebaseControl, NgxFirebaseControlOptions } from '@nowzoo/ngx-firebase-forms';
// etc..

export class MyComponent implements OnInit {
  control: NgxFirebaseControl;
  ref: Reference;
  constructor(
    private afDb: AngularFireDatabase
  ){}
  ngOnInit() {
    // Note the library does not depend on angularfire2. You can get a firebase ref however you wish.
    this.ref = this.afDb.database.ref(`foo/bar`) as Reference;
    const options: NgxFirebaseControlOptions = {ref: ref, updateOn: 'blur', trim: true, validators: [Validators.required] };
    this.control = new NgxFirebaseControl(options);
    // the control is automatically populated with the database value,
    // and changes to its value are automatically saved (if the control is valid)
  }
}
```

Using `NgxFirebaseFormBuilder` to create a `FormGroup`...

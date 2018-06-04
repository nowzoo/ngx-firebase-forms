import { FormGroup, AbstractControlOptions } from '@angular/forms';
import { Reference } from '@firebase/database';
import { NgxFirebaseControl } from './ngx-firebase-control.class';
import { NgxFirebaseGroupConfig, NgxFirebaseControlOptions } from './interfaces';

export class NgxFirebaseFormBuilder {
  static group(parentRef: Reference, config: NgxFirebaseGroupConfig, recentlySavedDelay?: number): FormGroup {
    const fg = new FormGroup({});
    Object.keys(config).forEach(key => {
      const options: NgxFirebaseControlOptions = Object.assign({}, config[key], {
        ref: parentRef.child(key),
        recentlySavedDelay: recentlySavedDelay
      });
      const fc = new NgxFirebaseControl(options);
      fg.addControl(key, fc);
    });
    return fg;
  }
}

import { FormControl, AbstractControlOptions, AsyncValidatorFn} from '@angular/forms';
import { Reference, DataSnapshot } from '@firebase/database';
import { take } from 'rxjs/operators';

import { NgxFirebaseSaveStatus, NgxFirebaseControlOptions } from './interfaces';
export class NgxFirebaseControl extends FormControl {

  ref: Reference;
  recentlySavedDelay: number;
  recentlySavedTimeout: any = null;
  saveStatus: NgxFirebaseSaveStatus;
  firebaseError: Error = null;
  constructor(
    options: NgxFirebaseControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(null, options, asyncValidator);
  }

  init(options: NgxFirebaseControlOptions) {
    this.ref = options.ref;
    this.recentlySavedDelay = options.recentlySavedDelay || 3000;
    this.saveStatus = NgxFirebaseSaveStatus.INITIALIZING;
    this.ref.once('value')
      .then((snap: DataSnapshot) => {
        const value = snap.val();
        this.setValue(value, {emitEvent: false});
        this.markAsPristine();
        this.saveStatus = NgxFirebaseSaveStatus.SAVED;
      })
      .catch((error) => this.handleError(error));
    this.valueChanges.subscribe((value) => this.onValueChange(value));
  }

  onValueChange(value:  any) {
    this.clearRecentlySavedTimeout();
    if (this.invalid) {
      this.saveStatus = NgxFirebaseSaveStatus.INVALID;
      return;
    }
    this.saveStatus = NgxFirebaseSaveStatus.SAVING;
    this.ref.set(value)
      .then(() => this.handleSuccess())
      .catch((error) => this.handleError(error));
  }

  clearRecentlySavedTimeout() {
    if (this.recentlySavedTimeout) {
      clearTimeout(this.recentlySavedTimeout);
      this.recentlySavedTimeout = null;
    }
  }

  handleError(error: Error) {
    this.firebaseError = error;
    this.saveStatus = NgxFirebaseSaveStatus.FIREBASE_ERROR;
  }

  handleSuccess() {
    this.markAsPristine();
    this.saveStatus = NgxFirebaseSaveStatus.RECENTLY_SAVED;
    this.recentlySavedTimeout = setTimeout(() => {
       this.saveStatus = NgxFirebaseSaveStatus.SAVED;
       this.clearRecentlySavedTimeout();
    }, this.recentlySavedDelay);
  }
}

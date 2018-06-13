import { FormControl } from '@angular/forms';
import { Reference, DataSnapshot } from '@firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxFirebaseSaveStatus, NgxFirebaseControlOptions } from './interfaces';
export class NgxFirebaseControl extends FormControl {

  private _options: NgxFirebaseControlOptions;
  get ref(): Reference {
    return this._options.ref;
  }

  get recentlySavedDelay(): number {
    return this._options.recentlySavedDelay || 3000;
  }
  private recentlySavedTimeout: any = null;

  get trim(): boolean {
    return  this._options.trim === true;
  }

  private firebaseError$$: BehaviorSubject<Error>;
  get firebaseError$(): Observable<Error> {
    return this.firebaseError$$.asObservable();
  }
  get firebaseError(): Error {
    return this.firebaseError$$.value;
  }

  private saveStatus$$: BehaviorSubject<NgxFirebaseSaveStatus>;
  get saveStatus$(): Observable<NgxFirebaseSaveStatus> {
    return this.saveStatus$$.asObservable();
  }
  get saveStatus(): NgxFirebaseSaveStatus {
    return this.saveStatus$$.value;
  }
  constructor(
    options: NgxFirebaseControlOptions
  ) {
    super(null, options.updateOn ? {updateOn: options.updateOn} : {});
    this.init(options);
  }

  init(options: NgxFirebaseControlOptions) {
    this._options = options;
    this.firebaseError$$ = new BehaviorSubject(null);
    this.saveStatus$$ = new BehaviorSubject(NgxFirebaseSaveStatus.INITIALIZING);
    this.ref.once('value')
      .then((snap: DataSnapshot) => {
        const value = snap.val();
        this.setValue(value, {emitEvent: false});
        if (options.validators) {
          this.setValidators(options.validators);
        }
        if (options.asyncValidators) {
          this.setAsyncValidators(options.asyncValidators);
        }
        this.markAsPristine();
        this.saveStatus$$.next(NgxFirebaseSaveStatus.SAVED);
      })
      .catch((error) => this.handleError(error));
    this.valueChanges.subscribe((value) => this.onValueChange(value));
  }

  onValueChange(value: any) {
    this.clearRecentlySavedTimeout();
    if (this.invalid) {
      this.saveStatus$$.next(NgxFirebaseSaveStatus.INVALID);
      return;
    }
    if (this.trim) {
      if ( 'string' !== typeof value) {
        return;
      }
      const str: string = value;
      if (str.length !== str.trim().length) {
        this.setValue(str.trim());
        this.updateValueAndValidity();
        return;
      }
    }
    this.saveStatus$$.next(NgxFirebaseSaveStatus.SAVING);
    if (this.trim) {
      value = value.trim();
    }
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
    this.firebaseError$$.next(error);
    this.saveStatus$$.next(NgxFirebaseSaveStatus.FIREBASE_ERROR);
  }

  handleSuccess() {
    this.markAsPristine();
    this.saveStatus$$.next(NgxFirebaseSaveStatus.RECENTLY_SAVED);
    this.firebaseError$$.next(null);
    this.recentlySavedTimeout = setTimeout(() => {
      this.saveStatus$$.next(NgxFirebaseSaveStatus.SAVED);
      this.clearRecentlySavedTimeout();
    }, this.recentlySavedDelay);
  }
}

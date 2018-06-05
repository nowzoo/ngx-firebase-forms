import { fakeAsync, tick } from '@angular/core/testing';
import { NgxFirebaseControl } from './ngx-firebase-control.class';
import { Validators } from '@angular/forms';
import { NgxFirebaseSaveStatus } from './interfaces';
describe('NgxFirebaseControl', () => {
  let ref: any;
  let snap: any;
  let dbVal;

  beforeEach(() => {
    dbVal = null;
    snap = {val: () => dbVal};
    spyOn(snap, 'val').and.callThrough();
    ref = {once: () => Promise.resolve(snap), set: () => Promise.resolve()};
    spyOn(ref, 'once').and.callThrough();
    spyOn(ref, 'set').and.callThrough();

  });
  it('should create an instance', () => {
    expect(new NgxFirebaseControl({ref: ref})).toBeTruthy();
  });
  describe('constructor() handling options and init', () => {
    it('should set updateOn to "blur" if that is passed', () => {
      const control = new NgxFirebaseControl({ref: ref, updateOn: 'blur'});
      expect(control.updateOn).toBe('blur');
    });
    it('should set updateOn to "submit" if that is passed', () => {
      const control = new NgxFirebaseControl({ref: ref, updateOn: 'submit'});
      expect(control.updateOn).toBe('submit');
    });
    it('should set updateOn to "change" if that is passed', () => {
      const control = new NgxFirebaseControl({ref: ref, updateOn: 'change'});
      expect(control.updateOn).toBe('change');
    });
    it('should set updateOn to "change" if no updateOn is passed', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.updateOn).toBe('change');
    });
    it('should set ref', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.ref).toBe(ref);
    });
    it('should set trim to true if true is passed', () => {
      const control = new NgxFirebaseControl({ref: ref, trim: true});
      expect(control.trim).toBe(true);
    });
    it('should set trim to false if false is passed', () => {
      const control = new NgxFirebaseControl({ref: ref, trim: false});
      expect(control.trim).toBe(false);
    });
    it('should set trim to false if it is not present', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.trim).toBe(false);
    });
    it('should set recentlySavedDelay to 3000 if it is not present', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.recentlySavedDelay).toBe(3000);
    });
    it('should set recentlySavedDelay to 4000 if it is set', () => {
      const control = new NgxFirebaseControl({ref: ref, recentlySavedDelay: 4000});
      expect(control.recentlySavedDelay).toBe(4000);
    });
    it('should have a firebaseError$ observable', () => {
      const control = new NgxFirebaseControl({ref: ref});
      control.firebaseError$.subscribe(val => {
        expect(val).toBe(null);
      });
    });
    it('should have a saveStatus$ observable', () => {
      const control = new NgxFirebaseControl({ref: ref});
      let value;
      control.saveStatus$.subscribe(val => {
        value = val;
      });
      expect(value).toBe(NgxFirebaseSaveStatus.INITIALIZING);
    });

  });

  describe('fetching the initial data', () => {
    it('should set firebaseError null', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.firebaseError).toBe(null);
    });
    it('should set saveStatus to "INITIALIZING"', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.INITIALIZING);
    });
    it('should call ref.once', () => {
      const control = new NgxFirebaseControl({ref: ref});
      expect(ref.once).toHaveBeenCalledWith('value');
    });
    it('should call control.setValue once the snap is fetched', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref});
      spyOn(control, 'setValue').and.callThrough();
      tick();
      expect(control.setValue).toHaveBeenCalledWith(dbVal, {emitEvent: false});
    }));
    it('should work if the dbVal is not null', fakeAsync(() => {
      dbVal = 123;
      const control = new NgxFirebaseControl({ref: ref});
      spyOn(control, 'setValue').and.callThrough();
      tick();
      expect(control.setValue).toHaveBeenCalledWith(123, {emitEvent: false});
    }));
    it('should set the validators if present once the snap is fetched', fakeAsync(() => {
      dbVal = 123;
      const validator = Validators.min(1);
      const control = new NgxFirebaseControl({ref: ref, validators: [validator]});
      spyOn(control, 'setValidators').and.callThrough();
      tick();
      expect(control.setValidators).toHaveBeenCalledWith([validator]);
    }));
    it('should set the async validators if present once the snap is fetched', fakeAsync(() => {
      dbVal = 123;
      const validator: any = jasmine.createSpy();
      const control = new NgxFirebaseControl({ref: ref, asyncValidators: [validator]});
      spyOn(control, 'setAsyncValidators').and.callThrough();
      tick();
      expect(control.setAsyncValidators).toHaveBeenCalledWith([validator]);
    }));
    it('should set the saveStatus to "SAVED"', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.SAVED);
    }));
    it('should handle a db error by setting the error', fakeAsync(() => {
      const e = new Error('foo');
      ref.once.and.callFake(() => Promise.reject(e));
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      expect(control.firebaseError).toBe(e);
    }));
    it('should handle a db error by setting the save status to "FIREBASE_ERROR"', fakeAsync(() => {
      const e = new Error('foo');
      ref.once.and.callFake(() => Promise.reject(e));
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.FIREBASE_ERROR);
    }));
  });

  describe('clearRecentlySavedTimeout()', () => {
    it('should clear the timeout', () => {
      spyOn(window, 'clearTimeout').and.callFake(() => {});
      const control = new NgxFirebaseControl({ref: ref});
      control.handleSuccess();
      control.clearRecentlySavedTimeout();
      expect(window.clearTimeout).toHaveBeenCalled();
    });
  });
  describe('handleSuccess()', () => {
    it('should call markAsPristine', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      spyOn(control, 'markAsPristine').and.callThrough();
      expect(control.markAsPristine).not.toHaveBeenCalled();
      control.handleSuccess();
      expect(control.markAsPristine).toHaveBeenCalled();
      tick(control.recentlySavedDelay);
    }));
    it('should set the save status', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      control.handleSuccess();
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.RECENTLY_SAVED);
      tick(control.recentlySavedDelay);
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.SAVED);
    }));
    it('should set firebaseError to null', fakeAsync(() => {
      const e = new Error('foo');
      ref.once.and.callFake(() => Promise.reject(e));
      const control = new NgxFirebaseControl({ref: ref});
      tick();
      expect(control.firebaseError).toBe(e);
      control.handleSuccess();
      expect(control.firebaseError).toBe(null);
      tick(control.recentlySavedDelay);
    }));
  });

  describe('handleError(err)', () => {
    it('should set the error', () => {
      const e = new Error('foo');
      const control = new NgxFirebaseControl({ref: ref});
      control.handleError(e);
      expect(control.firebaseError).toBe(e);
    });
    it('should set the save status', () => {
      const e = new Error('foo');
      const control = new NgxFirebaseControl({ref: ref});
      control.handleError(e);
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.FIREBASE_ERROR);
    });
  });

  describe('onValueChange(value: any)', () => {

    it('should clear the timeout', () => {
      const control = new NgxFirebaseControl({ref: ref});
      spyOn(control, 'clearRecentlySavedTimeout').and.callFake(() => {});
      control.onValueChange('foo');
      expect(control.clearRecentlySavedTimeout).toHaveBeenCalled();
    });
    it('should bail if the control is invalid', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref, validators: [Validators.required]});
      tick(); // init
      control.setValue('');
      tick();
      expect(ref.set).not.toHaveBeenCalled();
    }));
    it('should bail if the control is invalid after trimming', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref, validators: [Validators.required], trim: true});
      tick(); // init
      control.setValue('    ');
      tick();
      expect(ref.set).not.toHaveBeenCalled();
    }));
    it('should bail if the control is invalid after trimming', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref, validators: [Validators.required], trim: true});
      tick(); // init
      control.setValue({});
      tick();
      expect(ref.set).not.toHaveBeenCalled();
    }));
    it('should set the ref if the control is valid', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref, validators: [Validators.required]});
      tick(); // init
      control.setValue('abc');
      tick(control.recentlySavedDelay);
      expect(ref.set).toHaveBeenCalledWith('abc');
    }));

    it('should trim the value', fakeAsync(() => {
      const control = new NgxFirebaseControl({ref: ref, validators: [Validators.required], trim: true});
      tick(); // init
      control.setValue('     abc    ');
      tick(control.recentlySavedDelay);
      expect(ref.set).toHaveBeenCalledWith('abc');
      expect(ref.set).not.toHaveBeenCalledWith('     abc    ');

    }));

    it('should set an error if ref.set fails', fakeAsync(() => {
      const e = new Error('foo');
      const control = new NgxFirebaseControl({ref: ref});
      ref.set.and.callFake(() => Promise.reject(e));
      tick(); // init
      control.setValue('abc');
      tick();
      expect(ref.set).toHaveBeenCalledWith('abc');
      expect(control.saveStatus).toBe(NgxFirebaseSaveStatus.FIREBASE_ERROR);
      expect(control.firebaseError).toBe(e);
    }));
  });

});

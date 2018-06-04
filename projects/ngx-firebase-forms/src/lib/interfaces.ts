import {  AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';
import { Reference } from '@firebase/database';

export enum NgxFirebaseSaveStatus {
  'INITIALIZING' = 'INITIALIZING',
  'INVALID' = 'INVALID',
  'RECENTLY_SAVED' = 'RECENTLY_SAVED',
  'SAVED' = 'SAVED',
  'SAVING' = 'SAVING',
  'FIREBASE_ERROR' = 'FIREBASE_ERROR',
}


export interface NgxFirebaseControlOptions extends  AbstractControlOptions {
  ref: Reference;
  recentlySavedDelay?: number;
  trim?: boolean;
}

export interface NgxFirebaseGroupConfigEntry extends  AbstractControlOptions {
  trim?: boolean;
}
export interface NgxFirebaseGroupConfig {
  [key: string]: NgxFirebaseGroupConfigEntry;
}

import { NgxFirebaseFormBuilder } from './ngx-firebase-form-builder.class';
import { NgxFirebaseControl } from './ngx-firebase-control.class';
describe('NgxFirebaseFormBuilder', () => {
  it('should create an instance', () => {
    expect(new NgxFirebaseFormBuilder()).toBeTruthy();
  });

  describe('group', () => {
    let ref: any;
    let childRef: any;
    beforeEach(() => {
      ref = {child: () => childRef};
      childRef = {once: () => Promise.resolve({val: () => null})};
      spyOn(ref, 'child').and.callThrough();
    });
    it('should create an NgxFirebaseControl for each key', () => {
      const fg = NgxFirebaseFormBuilder.group(ref, {
        name: null,
        age: null,
        bio: null
      });
      expect(fg.get('name') instanceof NgxFirebaseControl).toBe(true);
      expect(fg.get('age') instanceof NgxFirebaseControl).toBe(true);
      expect(fg.get('bio') instanceof NgxFirebaseControl).toBe(true);
    });
    it('should call ref.child for each key', () => {
      const fg = NgxFirebaseFormBuilder.group(ref, {
        name: null,
        age: null,
        bio: null
      });
      expect(ref.child).toHaveBeenCalledWith('name');
      expect(ref.child).toHaveBeenCalledWith('age');
      expect(ref.child).toHaveBeenCalledWith('bio');
    });
  });
});

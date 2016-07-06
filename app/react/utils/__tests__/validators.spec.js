import { assert } from 'chai';
import { validateEmail } from '../validators';

describe('validateEmail test suite', () => {
  it('should return false for undefined and null values', () => {
    assert.isNotTrue(validateEmail(undefined));
    assert.isNotTrue(validateEmail(null));
  });
});

'use strict';
const assert = require('yeoman-assert');

const { capitalize, choicesFor } = require('../generators/helpers');

describe('helpers', () => {
  describe('#choicesFor', () => {
    it('returns the requested distros only', () => {
      const actual = choicesFor(['ubuntu']);

      expect(actual).toMatchSnapshot();
    });

    it('works with multiple distros', () => {
      const actual = choicesFor(['debian', 'ubuntu']);

      expect(actual).toMatchSnapshot();
    });
  });

  describe('#capitalize', () => {
    it('correctly transforms single words', () => {
      const expected = 'Hello';

      const actual = capitalize('hello');

      assert.equal(actual, expected);
    });
  });
});

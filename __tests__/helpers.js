'use strict';
const { choicesFor } = require('../generators/helpers');

describe('helpers', () => {
  describe('#choicesFor', () => {
    it('returns the requested distros', () => {
      const actual = choicesFor(['ubuntu']);

      expect(actual).toMatchSnapshot();
    });

    it('returns only the requested distros', () => {
      const actual = choicesFor(['debian']);

      expect(actual).toMatchSnapshot();
    });
  });
});

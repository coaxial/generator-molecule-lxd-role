'use strict';
const { contains, unnest } = require('ramda');

const assert = require('yeoman-assert');

const { choicesFor } = require('../generators/helpers');

describe('helpers', () => {
  describe('#choicesFor', () => {
    it('returns the requested distros', () => {
      const containsUbuntus = contains({ distribution: 'ubuntu' });

      const actual = choicesFor(['ubuntu']);

      console.log(JSON.stringify(actual));

      assert(containsUbuntus(unnest(actual)));
    });

    it('returns only the requested distros', () => {
      const containsUbuntus = contains({ distribution: 'ubuntu' });

      const actual = choicesFor(['debian']);

      console.log(JSON.stringify(actual));

      assert.equal(containsUbuntus(unnest(actual)), false);
    });
  });
});

'use strict';
const assert = require('yeoman-assert');

const { capitalize, choicesFor, parseDeps } = require('../generators/helpers');

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

  describe('#parseDeps', () => {
    describe('when there is a name', () => {
      const testDeps =
        '- name: username.myrole\n  src: https://bithub.com/username/myrole.git';

      it('uses the name', () => {
        const expected = ['username.myrole'];

        const actual = parseDeps(testDeps);

        assert.deepStrictEqual(actual, expected);
      });
    });

    describe('when there is no name', () => {
      const testDeps = '- src: https://bithub.com/username/role-name.git';

      it('builds a name from the URL', () => {
        const expected = ['role-name'];

        const actual = parseDeps(testDeps);

        assert.deepStrictEqual(actual, expected);
      });
    });
  });
});

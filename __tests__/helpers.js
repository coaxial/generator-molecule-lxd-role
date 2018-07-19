'use strict';
const assert = require('yeoman-assert');

const { PLATFORMS } = require('../generators/constants');
const {
  capitalize,
  listPlatforms,
  listVersions,
  parseDeps,
} = require('../generators/helpers');

describe('helpers', () => {
  describe('#listVersions', () => {
    it('returns the list of versions', () => {
      const actual = listVersions(['UBUNTU', 'DEBIAN']);

      expect(actual).toMatchSnapshot();
    });
  });

  describe('#listPlatforms', () => {
    it('returns the list of platforms', () => {
      const actual = listPlatforms(PLATFORMS);

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
    it('handles being passed undefined', () => {
      assert.doesNotThrow(() => parseDeps(undefined));
    });

    it('handles being passed empty string', () => {
      assert.doesNotThrow(() => parseDeps(''));
    });

    it('handles being passed empty array', () => {
      assert.doesNotThrow(() => parseDeps([]));
    });

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

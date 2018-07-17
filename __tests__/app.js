'use strict';
const { paramCase } = require('change-case');

const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('generator-molecule-lxd-role:app', () => {
  const testResponses = {
    roleName: 'Test role',
    roleDesc: 'This is a test description for the role.',
    hasDeps: true,
    roleDeps:
      '- src: https://bithub.com/username/role.git\n- name: username.myrole\n  src: https://bithub.com/username/myrole.git',
    hasReqs: true,
    roleReqs: 'This role makes some assumptions.',
    license: 'MIT',
    authorName: 'Test author',
    authorOrganization: 'Test organization',
    authorWebsite: 'https://example.org',
  };

  const paths = {
    base: 'ansible-role-test-role',
  };

  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts(testResponses);
  });

  it('creates files', () => {
    assert.file([`${paths.base}/README.md`]);
  });

  describe('files contents', () => {
    describe('README.md', () => {
      it('contains the role name as the title', () => {
        assert.fileContent(`${paths.base}/README.md`, testResponses.roleName);
      });

      it('contains the description', () => {
        assert.fileContent(`${paths.base}/README.md`, testResponses.roleDesc);
      });

      it('contains the dependencies', () => {
        const expected = '- https://bithub.com/username/role.git\n- username.myrole';

        assert.fileContent(`${paths.base}/README.md`, expected);
      });

      it('contains the requirements', () => {
        assert.fileContent(`${paths.base}/README.md`, testResponses.roleReqs);
      });

      it('contains a valid example', () => {
        const expected = `  roles:\n    - ${paramCase(testResponses.roleName)}`;

        assert.fileContent(`${paths.base}/README.md`, expected);
      });

      it('contains the license', () => {
        assert.fileContent(`${paths.base}/README.md`, testResponses.license);
      });

      it("contains the author's information", () => {
        const expected = `${testResponses.authorName} ([${
          testResponses.authorOrganization
        }](${testResponses.authorWebsite}))`;

        assert.fileContent(`${paths.base}/README.md`, expected);
      });
    });
  });
});

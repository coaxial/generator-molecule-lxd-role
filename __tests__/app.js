'use strict';
const { forEach } = require('ramda');
const { paramCase } = require('change-case');

const helpers = require('yeoman-test');
const path = require('path');

const { testFileContents } = require('./__helpers__');

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

  describe('creates files', () => {
    describe('README.md', () => {
      const filePath = `${paths.base}/README.md`;
      const thingsToTest = [
        {
          expected: testResponses.roleName,
          testDescription: 'the role name',
        },
        {
          expected: testResponses.roleDesc,
          testDescription: 'the role description',
        },
        {
          expected: '- https://bithub.com/username/role.git\n- username.myrole',
          testDescription: 'the dependencies',
        },
        {
          expected: testResponses.roleReqs,
          testDescription: 'the requirements',
        },
        {
          expected: `  roles:\n    - ${paramCase(testResponses.roleName)}`,
          testDescription: 'a valid example',
        },
        {
          expected: testResponses.license,
          testDescription: 'the license',
        },
        {
          expected: `${testResponses.authorName} ([${testResponses.authorOrganization}](${
            testResponses.authorWebsite
          }))`,
          testDescription: "the author's information",
        },
      ];

      forEach(
        thing =>
          testFileContents({
            filePath,
            expected: thing.expected,
            testDescription: thing.testDescription,
          }),
        thingsToTest,
      );
    });
  });
});

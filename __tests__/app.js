'use strict';
const { forEach } = require('ramda');
const { paramCase } = require('change-case');

const assert = require('yeoman-assert');
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
    // Might have to change prompt so that it first asks for families of OS and then which versions amongst these.
    // right now supportedPlatforms can be an array of platforms or a nested array of platforms
    supportedPlatforms: [
      {
        family: 'debian',
        distribution: 'ubuntu',
        codeName: 'trusty',
        versionNumber: '14.04',
        tags: ['lts', 'current'],
      },
      {
        family: 'debian',
        distribution: 'ubuntu',
        codeName: 'xenial',
        versionNumber: '16.04',
        tags: ['lts', 'current'],
      },
      {
        family: 'debian',
        distribution: 'ubuntu',
        codeName: 'bionic',
        versionNumber: '18.04',
        tags: ['lts', 'current'],
      },
    ],
  };

  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts(testResponses);
  });

  describe('creates files', () => {
    describe('README.md', () => {
      const filePath = 'README.md';

      it('exists', () => {
        assert.file(filePath);
      });

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

    describe('molecule/create.yml', () => {
      it('exists', () => {
        assert.file('molecule/create.yml');
      });
    });

    describe('molecule/destroy.yml', () => {
      it('exists', () => {
        assert.file('molecule/destroy.yml');
      });
    });

    describe('molecule/default/molecule.yml', () => {
      const filePath = 'molecule/default/molecule.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      const thingsToTest = [
        {
          expected:
            'platforms:\n  - name: trusty\n    alias: ubuntu/trusty\n  - name: xenial\n    alias: ubuntu/xenial\n  - name: bionic\n    alias: ubuntu/bionic\n',
          testDescription: 'the chosen platforms',
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

    describe('molecule/default/playbook.yml', () => {
      it('exists', () => {
        assert.file('molecule/default/playbook.yml');
      });
    });
  });
});

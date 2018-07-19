'use strict';
const { clone, forEach } = require('ramda');
const { paramCase } = require('change-case');

const { readFileSync } = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

const { testFileContents } = require('./__helpers__');

describe('generator-molecule-lxd-role:app', () => {
  const defaultResponses = {
    roleName: 'Test role',
    repoName: 'ansible-role-test-role',
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
    minAnsibleVer: '2.4',
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

  describe('when all the prompts have answers', () => {
    const clonedResponses = clone(defaultResponses);

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .inTmpDir(dir => console.log({ dir }))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      const filePath = 'README.md';

      it('exists', () => {
        assert.file(filePath);
      });

      const thingsToTest = [
        {
          expected: defaultResponses.roleName,
          testDescription: 'the role name',
        },
        {
          expected: defaultResponses.roleDesc,
          testDescription: 'the role description',
        },
        {
          expected: '- role\n- username.myrole',
          testDescription: 'the dependencies',
        },
        {
          expected: defaultResponses.roleReqs,
          testDescription: 'the requirements',
        },
        {
          expected: `  roles:\n    - ${paramCase(defaultResponses.roleName)}`,
          testDescription: 'a valid example',
        },
        {
          expected: defaultResponses.license,
          testDescription: 'the license',
        },
        {
          expected: `${defaultResponses.authorName} ([${
            defaultResponses.authorOrganization
          }](${defaultResponses.authorWebsite}))`,
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
            'platforms:\n  - name: trusty\n    alias: images:ubuntu/trusty\n  - name: xenial\n    alias: images:ubuntu/xenial\n  - name: bionic\n    alias: images:ubuntu/bionic\n',
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
      const filePath = 'molecule/default/playbook.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      const thingsToTest = [
        {
          expected: '    - name: test-role\n',
          testDescription: 'the role name',
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

    describe('molecule/default/tests/test_default.py', () => {
      const filePath = 'molecule/default/tests/test_default.py';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('.gitignore', () => {
      const filePath = '.gitignore';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('defaults/main.yml', () => {
      const filePath = 'defaults/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('handlers/main.yml', () => {
      const filePath = 'handlers/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('meta/main.yml', () => {
      const filePath = 'meta/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      const thingsToTest = [
        {
          expected: defaultResponses.authorName,
          testDescription: 'the author name',
        },
        {
          expected: defaultResponses.authorOrganization,
          testDescription: 'the author organization',
        },
        {
          expected: defaultResponses.license,
          testDescription: 'the license',
        },
        {
          expected: defaultResponses.minAnsibleVer,
          testDescription: 'the minimal ansible version',
        },
        {
          expected: defaultResponses.roleDesc,
          testDescription: 'the role description',
        },
        {
          expected:
            '  platforms:\n    - name: ubuntu\n      versions:\n        - trusty\n        - xenial\n        - bionic\n',
          testDescription: 'the chosen platforms',
        },
        {
          expected: '- { role: role }\n    - { role: username.myrole }\n',
          testDescription: 'the dependent roles',
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

    describe('tasks/main.yml', () => {
      const filePath = 'tasks/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('vars/main.yml', () => {
      const filePath = 'vars/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('.travis/setup.sh', () => {
      const filePath = '.travis/setup.sh';

      it('exists', () => {
        assert.file(filePath);
      });
    });

    describe('.travis.yml', () => {
      const filePath = '.travis.yml';

      it('exists', () => {
        assert.file(filePath);
      });
    });
  });

  describe.only('when there is no organization', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.authorOrganization = undefined;
    console.log({ clonedResponses });

    beforeAll(() => {
      console.log({ clonedResponses });
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .inTmpDir(dir => console.log({ dir }))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      it('formats the author information properly', () => {
        const actual = readFileSync('README.md', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('meta/main.yml', () => {
      it('formats the metadata properly', () => {
        const actual = readFileSync('meta/main.yml', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });

  describe('when there is no website', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.authorWebsite = undefined;

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      it('formats the author information properly', () => {
        const actual = readFileSync('README.md', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('meta/main.yml', () => {
      it('formats the metadata properly', () => {
        const actual = readFileSync('meta/main.yml', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });

  describe('when there are no dependencies', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.hasDeps = false;
    clonedResponses.roleDeps = undefined;

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      it('skips the dependencies section', () => {
        const actual = readFileSync('README.md', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('meta/main.yml', () => {
      it('formats the metadata properly', () => {
        const actual = readFileSync('meta/main.yml', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });

  describe('when there are no requirements', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.hasReqs = false;
    clonedResponses.roleReqs = undefined;

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      it('skips the requirents section', () => {
        const actual = readFileSync('README.md', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('meta/main.yml', () => {
      it('formats the metadata properly', () => {
        const actual = readFileSync('meta/main.yml', 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });
});

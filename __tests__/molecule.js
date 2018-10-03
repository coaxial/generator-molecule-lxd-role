'use strict';
const { clone } = require('ramda');

const { readFileSync } = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('generator-molecule-lxd-role:molecule', () => {
  const subgeneratorPath = '../generators/molecule';
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
    targetDistributions: ['UBUNTU'],
    galaxyTags: ['test', 'system', 'linux'],
    useTravis: true,
    travisUsername: 'test-travis-username',
    targetVersions: [
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
        .run(path.join(__dirname, subgeneratorPath))
        .withPrompts(clonedResponses);
    });

    describe('molecule/create.yml', () => {
      const filePath = 'molecule/create.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('molecule/destroy.yml', () => {
      const filePath = 'molecule/destroy.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('molecule/default/molecule.yml', () => {
      const filePath = 'molecule/default/molecule.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('molecule/default/playbook.yml', () => {
      const filePath = 'molecule/default/playbook.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('molecule/default/tests/test_default.py', () => {
      const filePath = 'molecule/default/tests/test_default.py';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('.yamllint', () => {
      const filePath = '.yamllint';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('.gitignore', () => {
      const filePath = '.gitignore';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });

  describe('when targetting another distribution than Ubuntu', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.targetDistributions = ['DEBIAN'];
    clonedResponses.targetVersions = [
      {
        family: 'debian',
        distribution: 'debian',
        codeName: 'jessie',
        versionNumber: '8',
        tags: ['current'],
      },
      {
        family: 'debian',
        distribution: 'debian',
        codeName: 'stretch',
        versionNumber: '9',
        tags: ['lts'],
      },
    ];

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, subgeneratorPath))
        .withPrompts(clonedResponses);
    });

    describe('molecule/default/molecule.yml', () => {
      const filePath = 'molecule/default/molecule.yml';

      it('formats the platform list properly', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });
});

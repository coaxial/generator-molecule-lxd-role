'use strict';
const { clone } = require('ramda');

const { readFileSync } = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('generator-molecule-lxd-role:molecule', () => {
  const subgeneratorPath = '../generators/molecule';
  const defaultResponses = {
    repoName: 'ansible-role-test-role',
    targetDistributions: ['UBUNTU'],
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

  describe('when generating for a role', () => {
    const clonedResponses = clone(defaultResponses);

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, subgeneratorPath))
        .withOptions({ mode: 'role' })
        .withPrompts(clonedResponses);
    });

    describe('molecule/default/molecule.yml', () => {
      const filePath = 'molecule/default/molecule.yml';

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
  });

  describe('when generating for a playbook', () => {
    const clonedResponses = clone(defaultResponses);

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, subgeneratorPath))
        .withOptions({ mode: 'playbook' })
        .withPrompts(clonedResponses);
    });

    describe('molecule/default/molecule.yml', () => {
      const filePath = 'molecule/default/molecule.yml';

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('molecule/default/playbook.yml', () => {
      const filePath = 'molecule/default/playbook.yml';

      it('does not exist', () => {
        assert.noFile(filePath);
      });
    });
  });
});

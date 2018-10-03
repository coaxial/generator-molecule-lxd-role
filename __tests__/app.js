'use strict';
const { clone } = require('ramda');

const { readFileSync } = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

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
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      const filePath = 'README.md';

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

    describe('defaults/main.yml', () => {
      const filePath = 'defaults/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('handlers/main.yml', () => {
      const filePath = 'handlers/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('meta/main.yml', () => {
      const filePath = 'meta/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('tasks/main.yml', () => {
      const filePath = 'tasks/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('vars/main.yml', () => {
      const filePath = 'vars/main.yml';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('.travis/setup.sh', () => {
      const filePath = '.travis/setup.sh';

      it('exists', () => {
        assert.file(filePath);
      });

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('.travis.yml', () => {
      const filePath = '.travis.yml';

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
  });

  describe('when there is no organization or website', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.authorOrganization = '';
    clonedResponses.authorWebsite = '';

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

  describe('when there is no organization', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.authorOrganization = '';

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

  describe('when there is no website', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.authorWebsite = '';

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

  describe('when Travis disabled', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.useTravis = false;
    clonedResponses.travisUsername = undefined;

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('README.md', () => {
      const filePath = 'README.md';

      it('skips the badge', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });

    describe('.travis.yml', () => {
      const filePath = '.travis.yml';

      it('does not exist', () => {
        assert.noFile(filePath);
      });
    });
  });

  describe('when there are no galaxy tags', () => {
    const clonedResponses = clone(defaultResponses);
    clonedResponses.galaxyTags = [];

    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(clonedResponses);
    });

    describe('meta/main.yml', () => {
      const filePath = 'meta/main.yml';

      it('is correctly formatted', () => {
        const actual = readFileSync(filePath, 'utf8');

        expect(actual).toMatchSnapshot();
      });
    });
  });
});

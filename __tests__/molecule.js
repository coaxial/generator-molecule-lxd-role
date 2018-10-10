'use strict';
const { readFileSync } = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

describe('generator-molecule-lxd-role:molecule', () => {
  const subgeneratorPath = '../generators/molecule';
  const modes = ['role', 'playbook'];

  modes.forEach(mode => {
    describe(`when generating a ${mode}`, () => {
      const defaultResponses = {};
      const defaultOptions = {
        repoName: 'test-role',
        projectName: 'Test project name',
        targetDistributions: ['UBUNTU'],
        mode,
        useTravis: true,
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

      describe('when Travis disabled', () => {
        beforeAll(() => {
          return helpers
            .run(path.join(__dirname, subgeneratorPath))
            .withOptions({ ...defaultOptions, useTravis: false })
            .withPrompts(defaultResponses);
        });

        describe('.travis.yml', () => {
          const filePath = '.travis.yml';

          it('does not exist', () => {
            assert.noFile(filePath);
          });
        });

        describe('.travis/setup.sh', () => {
          const filePath = '.travis/setup.sh';

          it('does not exist', () => {
            assert.noFile(filePath);
          });
        });
      });

      describe('when all the prompts have answers', () => {
        beforeAll(() => {
          return helpers
            .run(path.join(__dirname, subgeneratorPath))
            .withOptions({
              ...defaultOptions,
              requirements: [
                { src: 'user/test' },
                {
                  name: 'test',
                  src: 'https://bithub.com/user/test.git',
                },
              ],
            })
            .withPrompts(defaultResponses);
        });

        if (mode === 'playbook') {
          describe('requirements.yml', () => {
            const filePath = 'requirements.yml';

            it('exists', () => {
              assert.file(filePath);
            });

            it('is correctly formatted', () => {
              const actual = readFileSync(filePath, 'utf8');

              expect(actual).toMatchSnapshot();
            });
          });
        }

        if (mode === 'role') {
          describe('requirements.yml', () => {
            const filePath = 'requirements.yml';

            it('does not exists', () => {
              assert.noFile(filePath);
            });
          });
        }

        describe('molecule/default/requirements.yml', () => {
          const filePath = 'molecule/default/requirements.yml';

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
        beforeAll(() => {
          return helpers
            .run(path.join(__dirname, subgeneratorPath))
            .withOptions({
              ...defaultOptions,
              targetVersions: [
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
              ],
              targetDistributions: ['DEBIAN'],
            })
            .withPrompts({
              ...defaultResponses,
            });
        });

        if (mode === 'playbook') {
          describe('requirements.yml', () => {
            const filePath = 'requirements.yml';

            it('exists', () => {
              assert.file(filePath);
            });

            it('is correctly formatted', () => {
              const actual = readFileSync(filePath, 'utf8');

              expect(actual).toMatchSnapshot();
            });
          });
        }

        if (mode === 'role') {
          describe('requirements.yml', () => {
            const filePath = 'requirements.yml';

            it('does not exists', () => {
              assert.noFile(filePath);
            });
          });
        }

        describe('molecule/default/requirements.yml', () => {
          const filePath = 'molecule/default/requirements.yml';

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

          it('formats the platform list properly', () => {
            const actual = readFileSync(filePath, 'utf8');

            expect(actual).toMatchSnapshot();
          });
        });
      });
    });
  });
});

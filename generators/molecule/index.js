'use strict';
const {
  either,
  forEach,
  isEmpty,
  isNil,
  map,
  not,
  path,
  prop,
  toUpper,
} = require('ramda');
const { paramCase } = require('change-case');
const { safeDump } = require('js-yaml');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const fsPath = require('path');

const { PLATFORMS, URLS } = require('../constants');
const { listPlatforms, listVersions, moleculePlatforms } = require('../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('mode', {
      type: String,
      required: false,
      desc:
        'Whether to generate molecule files for a role or for a playbook. Acceptable values are "role" or "playbook".',
    });

    this.option('convergePath', {
      type: String,
      required: false,
      desc: 'Path to the playbook to test, relative to <repo root>/molecule/default/.',
    });

    this.option('useTravis', {
      type: Boolean,
      required: false,
      desc: 'Whether to generate the required files for running molecule on travis CI.',
    });

    this.option('projectName', {
      type: String,
      required: false,
      desc:
        'Full name for the project being generated. For example `My Awesome Project`. Will be used to derive default values for creating directories etc.',
    });

    this.option('targetVersions', {
      type: Array,
      required: false,
      desc:
        'An array of version objects: `{ family: "debian", distribution: "ubuntu", codeName: "trusty", versionNumber: "14.04", tags: ["lts", "current"] }`. For more details, cf. https://github.com/coaxial/generator-molecule-lxd-role/blob/master/generators/constants.js',
    });

    this.option('repoName', {
      type: String,
      required: false,
      desc: 'Name for the root directory in which the project lives.',
    });
  }

  prompting() {
    const options = this.options;
    const prompts = [
      {
        type: 'list',
        name: 'mode',
        choices: ['playbook', 'role'],
        message: 'What are you generating?',
        default: this.options.mode || 'role',
        when: isNil(path(['mode'], this.options)),
      },
      {
        type: 'input',
        name: 'convergePath',
        message:
          'Where is the playbook under test located (relative to <repo root>/molecule/default/)?',
        default: this.options.convergePath || '../../playbook.yml',
        when: answers =>
          isNil(path(['convergePath'], options)) &&
          (options.mode === 'playbook' || answers.mode === 'playbook'),
      },
      {
        type: 'input',
        name: 'projectName',
        message: "What is the project's name?",
        default: this.options.projectName || 'My Project',
        when: this.options.projectName === undefined,
      },
      {
        type: 'input',
        name: 'repoName',
        message: `What is the project's root directory name?`,
        default: answers =>
          options.repoName ||
          `ansible-${options.mode || answers.mode}-${paramCase(
            options.projectName || answers.projectName,
          )}`,
        when: isNil(path(['repoName'], this.options)),
      },
      {
        type: 'checkbox',
        name: 'targetDistributions',
        message: `Which distributions does this role target? ${chalk.reset.gray.italic(
          'Is your favourite distribution missing? Let us know here: ' + URLS.ISSUES,
        )}`,
        choices: listPlatforms(PLATFORMS),
        store: true,
        validate: answer => not(either(isEmpty, isNil)(answer)),
        filter: map(toUpper),
        when: isNil(path(['targetVersions'], this.options)),
      },
      {
        type: 'checkbox',
        name: 'targetVersions',
        message: `Which versions does this role support? ${chalk.reset.gray.italic(
          'Are the versions outdated? File an issue here: ' + URLS.ISSUES,
        )}`,
        choices: answers => listVersions(prop('targetDistributions', answers)),
        store: true,
        validate: answer => not(either(isEmpty, isNil)(answer)),
        default: this.options.targetVersions,
        when: isNil(path(['targetVersions'], this.options)),
      },
      {
        type: 'confirm',
        name: 'useTravis',
        message: 'Use Travis CI?',
        default: this.options.useTravis || true,
        store: true,
        when: isNil(path(['useTravis'], this.options)),
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = {
        useTravis: this.options.useTravis,
        mode: this.options.mode,
        convergePath: this.options.convergePath,
        projectName: this.options.projectName,
        targetVersions: this.options.targetVersions,
        repoName: this.options.repoName,
        ...props,
      };
    });
  }

  writing() {
    const { mode, repoName, targetVersions, useTravis, convergePath } = this.props;
    const destinationPath = repoName;

    // Create role directory if it doesn't already exist and set it as the root
    if (fsPath.basename(this.destinationPath()) !== destinationPath) {
      this.log(`Creating your new role in ${destinationPath}...`);
      mkdirp(destinationPath);
      this.destinationRoot(this.destinationPath(destinationPath));
    }
    // Create the rest of the directories
    const dirs = ['molecule/default/tests'];

    forEach(mkdirp, dirs);

    // Copy files
    if (useTravis) {
      mkdirp.sync('.travis');
      this.fs.copy(
        this.templatePath('setup.sh'),
        this.destinationPath('.travis/setup.sh'),
      );
      this.fs.copy(this.templatePath('.travis.yml'), this.destinationPath('.travis.yml'));
    }

    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('create.yml'),
      this.destinationPath('molecule/create.yml'),
    );

    this.fs.copy(
      this.templatePath('destroy.yml'),
      this.destinationPath('molecule/destroy.yml'),
    );

    this.fs.copyTpl(
      this.templatePath('molecule.yml.ejs'),
      this.destinationPath('molecule/default/molecule.yml'),
      {
        platforms: safeDump({ platforms: moleculePlatforms(targetVersions) }),
        playbookMode: mode === 'playbook',
        convergePath: convergePath,
      },
    );

    // When testing a playbook, the converge playbook is the playbook under
    // test but when testing a role, a default converge playbook running the
    // role is needed
    if (mode === 'role') {
      this.fs.copyTpl(
        this.templatePath('playbook.yml.ejs'),
        this.destinationPath('molecule/default/playbook.yml'),
        { roleName: repoName },
      );
    }

    this.fs.copy(
      this.templatePath('test_default.py'),
      this.destinationPath('molecule/default/tests/test_default.py'),
    );

    this.fs.copy(this.templatePath('.yamllint'), this.destinationPath('.yamllint'));
  }
};

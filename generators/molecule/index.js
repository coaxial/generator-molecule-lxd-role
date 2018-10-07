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
  }

  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

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
        when: isNil(path.convergePath, this.options),
      },
      {
        type: 'input',
        name: 'repoName',
        message: "What is the project's directory name?",
        default: answers => `ansible-role-${paramCase(answers.roleName)}`,
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
    // if (path(['useTravis'], p)) {
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

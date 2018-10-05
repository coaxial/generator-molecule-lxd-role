'use strict';
const { either, forEach, isEmpty, isNil, map, not, prop, toUpper } = require('ramda');
const { paramCase } = require('change-case');
const { safeDump } = require('js-yaml');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const path = require('path');

const { PLATFORMS, URLS } = require('../constants');
const { listPlatforms, listVersions, moleculePlatforms } = require('../helpers');

module.exports = class extends Generator {
  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

    const prompts = [
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
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const p = this.props;
    const destinationPath = p.repoName;

    // Create role directory if it doesn't already exist and set it as the root
    if (path.basename(this.destinationPath()) !== destinationPath) {
      this.log(`Creating your new role in ${destinationPath}...`);
      mkdirp(destinationPath);
      this.destinationRoot(this.destinationPath(destinationPath));
    }
    // Create the rest of the directories
    const dirs = ['molecule/default/tests'];

    forEach(mkdirp, dirs);

    // Copy files
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
        platforms: safeDump({ platforms: moleculePlatforms(p.targetVersions) }),
      },
    );

    this.fs.copyTpl(
      this.templatePath('playbook.yml.ejs'),
      this.destinationPath('molecule/default/playbook.yml'),
      { roleName: p.repoName },
    );

    this.fs.copy(
      this.templatePath('test_default.py'),
      this.destinationPath('molecule/default/tests/test_default.py'),
    );

    this.fs.copy(this.templatePath('.yamllint'), this.destinationPath('.yamllint'));
  }
};

'use strict';
const { forEach } = require('ramda');
const { safeDump } = require('js-yaml');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const path = require('path');

const { moleculePlatforms } = require('../helpers');
const prompts = require('./prompts');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('mode', {
      type: String,
      required: false,
      default: 'role',
      desc:
        'Whether to generate molecule files for a role or for a playbook. Acceptable values are "role" or "playbook".',
    });

    this.option('convergePath', {
      type: String,
      required: false,
      default: '../../playbook.yml',
      desc:
        'Path to the playbook to test, relative to <repo root>/molecule/default/. Defaults to "../../playbook.yml", i.e. "<repo root>/playbook.yml".',
    });
  }

  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

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
        playbookMode: this.options.mode === 'playbook',
        convergePath: this.options.convergePath,
      },
    );

    // When testing a playbook, the converge playbook is the playbook under
    // but when testing a role, a default converge playbook running the role is
    // needed
    if (this.options.mode === 'role') {
      this.fs.copyTpl(
        this.templatePath('playbook.yml.ejs'),
        this.destinationPath('molecule/default/playbook.yml'),
        { roleName: p.repoName },
      );
    }

    this.fs.copy(
      this.templatePath('test_default.py'),
      this.destinationPath('molecule/default/tests/test_default.py'),
    );

    this.fs.copy(this.templatePath('.yamllint'), this.destinationPath('.yamllint'));
  }
};

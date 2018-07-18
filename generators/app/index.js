'use strict';
const { forEach } = require('ramda');
const { paramCase } = require('change-case');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const path = require('path');

const { ANSIBLE_VERSIONS, LICENSES, URLS } = require('../constants');
const { choicesFor, parseDeps } = require('../helpers');

module.exports = class extends Generator {
  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

    const prompts = [
      {
        type: 'input',
        name: 'roleName',
        message: "What is the new role's name?",
      },
      {
        type: 'confirm',
        name: 'repoNameDiffers',
        message: "Use a different name for the role's directory?",
        default: true,
        store: true,
      },
      {
        when: answers => answers.repoNameDiffers,
        type: 'input',
        name: 'repoName',
        message: "What will be the role's directory name?",
        default: answers => `ansible-role-${paramCase(answers.roleName)}`,
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Who is this role's author (full name or nickname)?",
        store: true,
      },
      {
        type: 'input',
        name: 'authorOrganization',
        message: `Which organization is this role published under? ${chalk.reset.gray.italic(
          '(optional)',
        )}`,
        store: true,
      },
      {
        type: 'input',
        name: 'authorWebsite',
        message: `What is the website for the company/author of this role? ${chalk.reset.gray.italic(
          '(optional)',
        )}`,
        store: true,
      },
      {
        type: 'input',
        name: 'roleDesc',
        message: `How would you describe this role's purpose in a few words? ${chalk.reset.gray.italic(
          'Markdown supported.',
        )}`,
      },
      {
        type: 'list',
        name: 'minAnsibleVer',
        message: 'What is the minimal Ansible version required to run this role?',
        choices: ANSIBLE_VERSIONS,
        default: '2.4',
        store: true,
      },
      {
        type: 'checkbox',
        name: 'supportedPlatforms',
        message: `Which platform does this role target? ${chalk.reset.gray.italic(
          'Is your favourite platform missing? Let us know here: ' +
            URLS.MISSING_PLATFORM,
        )}`,
        choices: choicesFor(['ubuntu', 'debian']),
        store: true,
      },
      {
        type: 'confirm',
        name: 'useTravis',
        message: 'Use Travis CI?',
        default: true,
        store: true,
      },
      {
        when: answers => answers.useTravis,
        type: 'input',
        name: 'travisUsername',
        message: 'What is your Travis CI username?',
        store: true,
      },
      {
        type: 'list',
        name: 'license',
        message: `Which license for this role? ${chalk.reset.gray.italic(
          'For help choosing, see ' + URLS.LICENSE_INFO,
        )}`,
        choices: LICENSES,
        default: 'MIT',
        store: true,
      },
      {
        type: 'input',
        name: 'galaxyTags',
        message: `Which Galaxy tags to give the role? ${chalk.reset.gray.italic(
          '(optional; single words, comma separated)',
        )}`,
      },
      {
        type: 'confirm',
        name: 'hasReqs',
        message: 'Does this role have any particular requirements?',
        default: false,
      },
      {
        when: answers => answers.hasReqs,
        type: 'editor',
        name: 'roleReqs',
        message: `Enter this role's requirements. ${chalk.reset.gray.italic(
          'Usually details specific OS requirements, assumptions, etc. Markdown valid here.',
        )}`,
      },
      {
        type: 'confirm',
        name: 'hasDeps',
        message: 'Does this role depend on any other?',
        default: false,
      },
      {
        when: answers => answers.hasDeps,
        type: 'editor',
        name: 'roleDeps',
        message:
          'Enter the roles on which your role will depend. See ' +
          URLS.DEPENDENCIES_FORMAT +
          " for how to format your entries, they'll be inserted verbatim into a requirements.yml file.",
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const destinationPath = this.props.repoName;

    // Create role directory if it doesn't already exist and set it as the root
    if (path.basename(this.destinationPath()) !== destinationPath) {
      this.log(`Creating your new role in ${destinationPath}...`);
      mkdirp(destinationPath);
      this.destinationRoot(this.destinationPath(destinationPath));
    }
    // Create the rest of the directories
    const dirs = [
      'defaults',
      'handlers',
      'meta',
      'molecule/default/tests',
      'tasks',
      'templates',
      'files',
      '.travis',
      'vars',
    ];

    forEach(mkdirp, dirs);

    // Copy files
    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      {
        roleName: this.props.roleName,
        roleDesc: this.props.roleDesc,
        hasDeps: this.props.hasDeps,
        roleDeps: parseDeps(this.props.roleDeps),
        hasReqs: this.props.hasReqs,
        roleReqs: this.props.roleReqs,
        roleNameExample: paramCase(this.props.roleName),
        license: this.props.license,
        authorName: this.props.authorName,
        authorOrganization: this.props.authorOrganization,
        authorWebsite: this.props.authorWebsite,
      },
    );

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
        platforms: this.props.supportedPlatforms,
      },
    );

    this.fs.copyTpl(
      this.templatePath('playbook.yml.ejs'),
      this.destinationPath('molecule/default/playbook.yml'),
    );
  }

  install() {
    this.installDependencies();
  }
};

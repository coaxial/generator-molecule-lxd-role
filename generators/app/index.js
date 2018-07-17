'use strict';
const Generator = require('yeoman-generator');

const { ANSIBLE_VERSIONS, LICENSES } = require('../constants');
const { choicesFor } = require('../helpers');

module.exports = class extends Generator {
  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

    const prompts = [
      {
        type: 'input',
        name: 'authorName',
        message: "Who is this role's author?",
        store: true,
      },
      {
        type: 'input',
        name: 'authorCompany',
        message: 'Which company is this role published under? (optional)',
        store: true,
      },
      {
        type: 'input',
        name: 'authorWebsite',
        message: 'What is the website for the company/author of this role? (optional)',
        store: true,
      },
      {
        type: 'input',
        name: 'roleDesc',
        message: "How would you describe this role's purpose in a few words?",
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
        message: 'Which platform does this role target?',
        choices: choicesFor(['ubuntu', 'debian']),
        store: true,
      },
      {
        type: 'confirm',
        name: 'travisEnable',
        message: 'Use Travis CI?',
        default: true,
        store: true,
      },
      {
        type: 'list',
        name: 'license',
        message: 'Which license for this role?',
        choices: LICENSES,
        default: 'MIT',
        store: true,
      },
      {
        type: 'input',
        name: 'galaxyTags',
        message: 'Which Galaxy tags to give the role? (single words, comma separated)',
      },
      {
        type: 'editor',
        name: 'galaxyDeps',
        message:
          'Which other roles (if any) does this role depend on? Leave blank if none.',
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt'),
      { dummyVar: 'heyo' },
    );
  }

  install() {
    this.installDependencies();
  }
};

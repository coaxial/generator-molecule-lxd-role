'use strict';
const Generator = require('yeoman-generator');

const { ANSIBLE_VERSIONS } = require('../constants');
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
      },
      {
        type: 'input',
        name: 'authorCompany',
        message: 'Which company is this role published under? (optional)',
      },
      {
        type: 'input',
        name: 'authorWebsite',
        message: 'What is the website for the company/author of this role? (optional)',
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
      },
      {
        type: 'checkbox',
        name: 'supportedPlatforms',
        message: 'Which platform does this role target?',
        choices: choicesFor(['ubuntu', 'debian']),
      },
      {
        type: 'confirm',
        name: 'travisEnable',
        message: 'Use Travis CI?',
        default: true,
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
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

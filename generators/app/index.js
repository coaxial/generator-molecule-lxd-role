'use strict';
const Generator = require('yeoman-generator');
const inquirer = require('inquirer');

module.exports = class extends Generator {
  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.'
    );

    const prompts = [
      {
        type: 'input',
        name: 'authorName',
        message: "Who is this role's author?"
      },
      {
        type: 'input',
        name: 'authorCompany',
        message: 'Which company is this role published under? (optional)'
      },
      {
        type: 'input',
        name: 'authorWebsite',
        message: 'What is the website for the company/author of this role? (optional)'
      },
      {
        type: 'input',
        name: 'roleDesc',
        message: "How would you describe this role's purpose in a few words?"
      },
      {
        type: 'list',
        name: 'minAnsibleVer',
        message: 'What is the minimal Ansible version required to run this role?',
        choices: [
          '1.5',
          '1.6',
          '1.7',
          '1.8',
          '1.9',
          '2.0',
          '2.1',
          '2.2',
          '2.3',
          '2.4',
          '2.5',
          '2.6'
        ],
        default: '2.4'
      },
      {
        type: 'checkbox',
        name: 'supportedPlatforms',
        message: 'Which platform does this role target?',
        choices: [
          new inquirer.Separator('== Ubuntu =='),
          {
            name: 'All current LTS: Trusty (14.04), Xenial (16.04), Bionic (18.04)',
            value: ['trusty', 'xenial', 'bionic']
          },
          {
            name: 'All recent: Xenial (16.04), Bionic (18.04), Cosmic (18.10)',
            value: ['xenial', 'bionic', 'cosmic']
          },
          {
            name: 'Trusty (14.04)',
            value: {
              family: 'ubuntu',
              codeName: 'trusty',
              version: '14.04'
            }
          },
          {
            name: 'Xenial (16.04)',
            value: ['xenial']
          },
          {
            name: 'Bionic (18.04)',
            value: ['bionic']
          },
          {
            name: 'Cosmic (18.10)',
            value: ['cosmic']
          },
          new inquirer.Separator('== Debian =='),
          {
            name: 'Wheezy (7)',
            value: {
              family: 'debian',
              codeName: 'wheezy',
              version: '7'
            }
          },
          {
            name: 'Jessie (8)',
            value: {
              family: 'debian',
              codeName: 'jessie',
              version: '8'
            }
          },
          {
            name: 'Stretch (9)',
            value: {
              family: 'debian',
              codeName: 'stretch',
              version: '9'
            }
          }
        ]
      },
      {
        type: 'confirm',
        name: 'travisEnable',
        message: 'Use Travis CI?',
        default: true
      }
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
      { dummyVar: 'heyo' }
    );
  }

  install() {
    this.installDependencies();
  }
};

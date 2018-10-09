'use strict';
const { forEach } = require('ramda');
const { paramCase } = require('change-case');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

const path = require('path');

const { indentYaml, parseDeps, platformsToMetaMain } = require('../helpers');
const prompts = require('./prompts');

module.exports = class extends Generator {
  prompting() {
    this.log(
      'This generator will create an Ansible role and test it with Molecule using LXD containers.',
    );

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    const { useTravis, roleName, targetVersions, repoName, roleDeps } = this.props;

    this.composeWith(require.resolve('../molecule'), {
      mode: 'role',
      useTravis,
      projectName: roleName,
      targetVersions,
      repoName,
      requirements: roleDeps,
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
    const dirs = ['defaults', 'handlers', 'meta', 'tasks', 'templates', 'files', 'vars'];

    forEach(mkdirp, dirs);

    // Copy files
    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      {
        authorName: p.authorName,
        authorOrganization: p.authorOrganization,
        authorWebsite: p.authorWebsite,
        hasDeps: p.hasDeps,
        hasReqs: p.hasReqs,
        license: p.license,
        repoName: p.repoName,
        roleDeps: parseDeps(p.roleDeps),
        roleDesc: p.roleDesc,
        roleName: p.roleName,
        roleNameExample: paramCase(p.roleName),
        roleReqs: p.roleReqs,
        useTravis: p.useTravis,
        travisUsername: p.travisUsername,
      },
    );

    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    const mains = ['defaults', 'handlers', 'tasks', 'vars'];
    forEach(
      f =>
        this.fs.copy(
          this.templatePath('main.yml'),
          this.destinationPath(`${f}/main.yml`),
        ),
      mains,
    );

    this.fs.copyTpl(
      this.templatePath('meta_main.yml.ejs'),
      this.destinationPath('meta/main.yml'),
      {
        authorName: p.authorName,
        authorOrganization: p.authorOrganization,
        // eslint-disable-next-line camelcase
        galaxyTags: indentYaml(2, { galaxy_tags: p.galaxyTags }),
        hasDeps: p.hasDeps,
        license: p.license,
        minAnsibleVer: p.minAnsibleVer,
        roleDeps: parseDeps(p.roleDeps),
        roleDesc: p.roleDesc,
        roleName: paramCase(p.roleName),
        targetVersions: indentYaml(4, platformsToMetaMain(p.targetVersions)),
      },
    );
  }
};

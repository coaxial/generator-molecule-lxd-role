'use strict';
const {
  append,
  either,
  forEach,
  isEmpty,
  isNil,
  map,
  not,
  path,
  prop,
  toUpper,
  type,
} = require('ramda');
const { paramCase } = require('change-case');
const { safeDump, safeLoad } = require('js-yaml');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

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

    this.option('requirements', {
      // Although it is really expecting an Array, setting the type to Array
      // wraps the supplied array in another array...
      type: Array,
      required: false,
      desc:
        'A list of dependencies to populate the requirements.yml file. A dependency is an object like `{ name: "my dep", src: "optional, if not from galaxy"}`; cf. ' +
        URLS.DEPENDENCIES_FORMAT +
        " for more details. The value for that option is a JavaScript object which you can get from a YAML string using the js-yaml package's safeLoad method.",
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
        default: this.options.targetVersions || [],
        when: isNil(path(['targetVersions'], this.options)),
      },
      {
        type: 'confirm',
        name: 'useTravis',
        message: 'Use Travis CI?',
        default: this.options.useTravis || true,
        store: true,
        when: isNil(this.options.useTravis),
      },
      {
        when: answers => answers.hasRequirements || isNil(options.requirements),
        type: 'editor',
        name: 'requirements',
        message: `Enter the roles on which this project depends. See ${
          URLS.DEPENDENCIES_FORMAT
        } for how to format your entries, they'll be inserted verbatim into a requirements.yml file.`,
        default: this.options.requirements || [],
        validate: answer => not(either(isEmpty, isNil)(answer)),
        filter: answer => safeLoad(answer),
      },
    ];

    return this.prompt(prompts).then(props => {
      const { useTravis, mode, convergePath, projectName, repoName } = this.options;
      let { requirements, targetVersions } = this.options;

      // This is necessary because otherwise the array supplied as
      // this.options.requirements will be nested inside an outer array.
      if (type(requirements) === 'Array') {
        requirements = requirements[0];
      }
      // Idem
      if (type(targetVersions) === 'Array') {
        targetVersions = targetVersions[0];
      }

      this.props = {
        useTravis,
        mode,
        convergePath,
        projectName,
        targetVersions,
        repoName,
        requirements,
        ...props,
      };
    });
  }

  writing() {
    const {
      mode,
      repoName,
      requirements,
      targetVersions,
      useTravis,
      convergePath,
    } = this.props;

    // Create the rest of the directories
    const dirs = ['molecule/default/tests'];

    forEach(mkdirp, dirs);

    // Copy files
    if (useTravis) {
      mkdirp.sync('.travis');
      this.fs.copy(this.templatePath('.travis.yml'), this.destinationPath('.travis.yml'));
      this.fs.copy(
        this.templatePath('setup.sh'),
        this.destinationPath('.travis/setup.sh'),
      );
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
        convergePath,
      },
    );

    // When testing a playbook, the converge playbook is the playbook under
    // test but when testing a role, a default converge playbook running the
    // role is needed
    this.fs.copyTpl(
      this.templatePath('playbook.yml.ejs'),
      this.destinationPath('molecule/default/playbook.yml'),
      { roleName: repoName },
    );

    this.fs.copy(
      this.templatePath('test_default.py'),
      this.destinationPath('molecule/default/tests/test_default.py'),
    );

    let requirementsDests = ['molecule/default/requirements.yml'];
    if (mode === 'playbook') {
      requirementsDests = append('requirements.yml', requirementsDests);
    }
    requirementsDests.forEach(dest =>
      this.fs.copyTpl(
        this.templatePath('requirements.yml.ejs'),
        this.destinationPath(dest),
        {
          requirements: safeDump(requirements),
        },
      ),
    );

    this.fs.copy(this.templatePath('.yamllint'), this.destinationPath('.yamllint'));
  }
};

const { either, isEmpty, isNil, map, not, prop, split, toUpper } = require('ramda');
const { paramCase } = require('change-case');
const chalk = require('chalk');

const { ANSIBLE_VERSIONS, LICENSES, PLATFORMS, URLS } = require('../constants');
const { listPlatforms, listVersions } = require('../helpers');

const prompts = [
  {
    type: 'input',
    name: 'roleName',
    message: "What is the new role's name?",
    validate: answer => not(either(isEmpty, isNil)(answer)),
  },
  {
    type: 'input',
    name: 'repoName',
    message: 'What directory will the role be created in?',
    default: answers => `ansible-role-${paramCase(answers.roleName)}`,
  },
  {
    type: 'input',
    name: 'authorName',
    message: "Who is this role's author (full name or nickname)?",
    store: true,
    validate: answer => not(either(isEmpty, isNil)(answer)),
  },
  {
    type: 'input',
    name: 'authorOrganization',
    message: `Which organization is this role published under? ${chalk.reset.gray.italic(
      '(optional)',
    )}`,
    store: true,
    default: '',
  },
  {
    type: 'input',
    name: 'authorWebsite',
    message: `What is the website for the company/author of this role? ${chalk.reset.gray.italic(
      '(optional)',
    )}`,
    store: true,
    default: '',
  },
  {
    type: 'input',
    name: 'roleDesc',
    message: `How would you describe this role's purpose in a few words? ${chalk.reset.gray.italic(
      'Markdown supported.',
    )}`,
    validate: answer => not(either(isEmpty, isNil)(answer)),
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
    default: true,
    store: true,
  },
  {
    when: answers => answers.useTravis,
    type: 'input',
    name: 'travisUsername',
    message: 'What is your Travis CI username?',
    store: true,
    validate: answer => not(either(isEmpty, isNil)(answer)),
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
    filter: answer => split(', ', answer),
    default: '',
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
    validate: answer => not(either(isEmpty, isNil)(answer)),
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
    validate: answer => not(either(isEmpty, isNil)(answer)),
  },
];

module.exports = prompts;

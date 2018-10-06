const { paramCase } = require('change-case');
const { either, isEmpty, isNil, map, not, prop, toUpper } = require('ramda');
const chalk = require('chalk');

const { PLATFORMS, URLS } = require('../constants');
const { listPlatforms, listVersions } = require('../helpers');

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

module.exports = prompts;

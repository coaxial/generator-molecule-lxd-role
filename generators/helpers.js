'use strict';
const { Separator } = require('inquirer');
const {
  compose,
  curry,
  either,
  head,
  ifElse,
  insert,
  isEmpty,
  isNil,
  join,
  juxt,
  keys,
  map,
  prop,
  propEq,
  tail,
  toLower,
  toUpper,
  unless,
  unnest,
} = require('ramda');
const { snakeCase } = require('change-case');
const jsyaml = require('js-yaml');

const { basename } = require('path');

const { PLATFORMS } = require('./constants');

// Utilities
const capitalize = compose(
  join(''),
  juxt([
    compose(
      toUpper,
      head,
    ),
    tail,
  ]),
);

// Private methods
const nameFromSrc = curry(url => basename(url, '.git'));
const nameOrSrc = curry(deps => {
  const fallbackProp = prop('src');
  const ownProp = prop('name');
  const name = d =>
    ownProp(d) ||
    compose(
      nameFromSrc,
      fallbackProp,
    )(d);

  return map(name, deps);
});
const separator = label => new Separator(`↓  ${capitalize(label)} ↓ `);
const versions = platformName =>
  insert(0, separator(toLower(platformName)), prop(platformName, PLATFORMS));

const generateListForVersions = map(version => {
  const isUbuntu = propEq('distribution', 'ubuntu');
  const ubuntuFormat = ubuntu => `ubuntu:${prop('versionNumber', ubuntu)}`;
  const nonUbuntuFormat = notUubntu =>
    `images:${prop('distribution', notUubntu)}/${prop('versionNumber', notUubntu)}`;
  const versionLabel = either(prop('codeName'), prop('versionNumber'));

  const aliasValue = ifElse(isUbuntu, ubuntuFormat, nonUbuntuFormat);

  return {
    name: snakeCase(`${prop('distribution', version)} ${versionLabel(version)}`),
    alias: aliasValue(version),
  };
});

// Public methods
const parseDeps = unless(
  either(isEmpty, isNil),
  compose(
    nameOrSrc,
    jsyaml.load,
  ),
);
const listPlatforms = compose(
  map(capitalize),
  map(toLower),
  keys,
);

const listVersions = compose(
  unnest,
  map(versions),
);

const moleculePlatforms = generateListForVersions;

module.exports = {
  listPlatforms,
  capitalize,
  parseDeps,
  listVersions,
  moleculePlatforms,
};

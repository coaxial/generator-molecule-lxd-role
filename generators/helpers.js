'use strict';
const { Separator } = require('inquirer');
const {
  compose,
  curry,
  either,
  head,
  insert,
  isEmpty,
  isNil,
  join,
  juxt,
  keys,
  map,
  prop,
  tail,
  toLower,
  toUpper,
  unless,
  unnest,
} = require('ramda');
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

module.exports = {
  listPlatforms,
  capitalize,
  parseDeps,
  listVersions,
};

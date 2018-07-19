'use strict';
const { Separator } = require('inquirer');
const {
  compose,
  concat,
  contains,
  curry,
  either,
  filter,
  head,
  isEmpty,
  isNil,
  join,
  juxt,
  map,
  or,
  pick,
  prop,
  tail,
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

// Tests
// Versions have tags to define whether they're LTS etc, we can use the tests to filter them out into separate lists.
const tagsProp = prop('tags');
const isLts = curry(version => contains('lts', tagsProp(version)));
const isCurrent = curry(version => contains('current', tagsProp(version)));

const isFuture = curry(version => contains('future', tagsProp(version)));
// Lists
const lts = filter(isLts);
const current = filter(isCurrent);
const future = filter(isFuture);
const all = map(version => ({
  name: or(capitalize(version.codeName), capitalize(version.versionNumber)),
  value: pick(['family', 'distribution', 'codeName', 'versionNumber'], version),
}));

// Private methods
const buildChoiceCategory = distroName => {
  // A choice category has a separator, then pre-defined groups of
  // versions (lts, current + future), and finally every version to
  // be picked individually.
  const versions = PLATFORMS[`${toUpper(distroName)}`];
  const separator = new Separator(`↓  ${capitalize(distroName)} ↓ `);
  const allLtsChoice = {
    name: `All LTS (${capitalize(distroName)})`,
    value: lts(versions),
  };
  const allCurrentAndFutureChoice = {
    name: `All current and future (${capitalize(distroName)})`,
    value: concat(current(versions), future(versions)),
  };
  const groupsChoice = [allLtsChoice, allCurrentAndFutureChoice];
  const individualChoice = all(versions);
  const allChoices = concat(groupsChoice, individualChoice);
  const choiceCategory = concat([separator], allChoices);

  return choiceCategory;
};

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

// Public methods
const choicesFor = compose(
  unnest,
  map(buildChoiceCategory),
);
const parseDeps = unless(
  either(isEmpty, isNil),
  compose(
    nameOrSrc,
    jsyaml.load,
  ),
);

module.exports = {
  choicesFor,
  capitalize,
  parseDeps,
};

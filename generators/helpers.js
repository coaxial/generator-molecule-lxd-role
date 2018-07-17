'use strict';
const { Separator } = require('inquirer');
const {
  compose,
  concat,
  contains,
  curry,
  filter,
  head,
  join,
  juxt,
  map,
  or,
  pick,
  prop,
  tail,
  toUpper,
  unnest,
} = require('ramda');

const { PLATFORMS } = require('./constants');

// Utilities
const capitalize = compose(join(''), juxt([compose(toUpper, head), tail]));

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

// Public methods
const choicesFor = compose(unnest, map(buildChoiceCategory));

module.exports = {
  choicesFor,
  capitalize,
};

const { Separator } = require('inquirer');
const {
  concat,
  contains,
  curry,
  filter,
  map,
  or,
  pick,
  prop,
  toUpper,
} = require('ramda');

const { PLATFORMS } = require('./constants');

const tagsProp = prop('tags');

// Versions have tags to define whether they're LTS etc, we can use the tests to filter them out into separate lists.
// Tests
//
// const isLts = curry(version =>
  // or(contains('lts', tagsProp(version)), contains('stable', tagsProp(version))),
// );
// const isCurrentOrFuture = curry(version =>
//   or(contains('current', tagsProp(version)), contains('future', tagsProp(version))),
// );
const isLts = curry(version => contains('lts', tagsProp(version)));
const isStable = curry(version => contains('stable', tagsProp(version)));
const isCurrent = curry(version => contains('stable', tagsProp(version)));
const isFuture = curry(version => contains('stable', tagsProp(version)));
// Lists
const ltsOnly = filter(isLts);
const currentAndFuture = filter(isCurrentOrFuture);
const all = map(version => ({
  name: or(version.codeName, version.versionNumber),
  value: pick(['family', 'distribution', 'codeName', 'versionNumber'], version),
}));

const buildChoiceCategory = distroName => {
  // A choice category has a separator, then pre-defined groups of
  // versions (lts, current + future), and finally every version to
  // be picked individually.
  const versions = PLATFORMS[`${toUpper(distroName)}`];
  const separator = new Separator(`== ${distroName} ==`);
  const allLtsChoice = {
    name: 'All LTS',
    value: ltsOnly(versions),
  };
  const allCurrentAndFutureChoice = {
    name: 'All current and future',
    value: currentAndFuture(versions),
  };
  const groupsChoice = [allLtsChoice, allCurrentAndFutureChoice];
  const individualChoice = all(versions);
  const allChoices = concat(groupsChoice, individualChoice);
  const choiceCategory = concat([separator], allChoices);

  return choiceCategory;
};

// Public methods
const choicesFor = map(buildChoiceCategory);

module.exports = {
  choicesFor,
};

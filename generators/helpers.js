const { Separator } = require('inquirer');
const {
  __,
  contains,
  curry,
  filter,
  map,
  or,
  pick,
  prop,
  toUpper
} = require('ramda');

const { PLATFORMS } = require('./constants');

const tagsProp = prop('tags');

const isLts = curry(version => contains('lts', tagsProp(version)));
const isCurrentOrFuture = curry(version => or(contains('current', tagsProp(version)), contains('future', tagsProp(version))))
const ltsOnly = filter(isLts);
const currentAndFuture = filter(isCurrentOrFuture);
const choicesValues = map(__, distro => ({
  name: distro.codeName,
  value: pick(['family', 'distribution', 'codeName', 'version']),
}));
const buildChoiceCategory = distroName => {
  const versions = PLATFORMS[`${toUpper(distroName)}`];
  // const tagProp = prop('tags')
  // const isIncluded = curry(distro => contains('lts', tagProp(distro)))
  // const ltsonly = filter(isIncluded, versions)
  // console.log(ltsonly)
  // const ltsonly = filter(contains('lts', tagProp(__)))
  // console.log(map(tagProp, versions))
  // console.log(versions);
  // console.log(filter(prop('tags'), versions));
  // console.log(map(filter(prop('tags')), versions))
  // console.log({tags: tagsProp(PLATFORMS[`${toUpper(distroName)}`])})
  console.log(ltsOnly(versions));
  console.log(currentAndFuture(versions));
  return [
    new Separator(`== ${distroName} ==`),
    {
      name: 'All LTS',
      value: ltsOnly(versions),
      // value: filter(isLts, PLATFORMS[`${toUpper(distroName)}`]),
    },
    {
      name: 'All current and future',
      value: currentAndFuture(versions),
      // value: filter(or(isCurrent, isFuture), PLATFORMS[`${toUpper(distroName)}`]),
    },
    // unnest(
    //   map(choicesValues, filterDistro(distroName, versions)),
    // ),
  ];
};

// Public methods
// const choicesFor = curry(distroName =>
//   concat(unnest(map(distroName, buildChoiceCategory))),
// );
const choicesFor = map(buildChoiceCategory);

module.exports = {
  choicesFor,
};

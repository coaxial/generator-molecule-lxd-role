'use strict';
const { Separator } = require('inquirer');
const {
  append,
  compose,
  concat,
  curry,
  either,
  findIndex,
  head,
  insert,
  isEmpty,
  isNil,
  join,
  juxt,
  keys,
  map,
  pipe,
  prop,
  propEq,
  reduce,
  repeat,
  replace,
  tail,
  toLower,
  toUpper,
  unless,
  unnest,
} = require('ramda');
const { paramCase } = require('change-case');
const { safeDump, safeLoad } = require('js-yaml');

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
const platformsToChoices = platformName => {
  const platforms = prop(platformName, PLATFORMS);

  return unnest(
    map(
      p => ({
        name: prop('versionNumber', p),
        value: p,
      }),
      platforms,
    ),
  );
};

const versions = platformName =>
  insert(0, separator(toLower(platformName)), platformsToChoices(platformName));

const generateListForVersions = map(version => {
  const versionLabel = either(prop('codeName'), prop('versionNumber'));
  const imagesFormat = item => `${prop('distribution', item)}/${versionLabel(item)}`;

  return {
    name: paramCase(imagesFormat(version)),
    alias: imagesFormat(version),
  };
});

// Public methods
const parseDeps = unless(
  either(isEmpty, isNil),
  compose(
    nameOrSrc,
    safeLoad,
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

const indent = curry((count, string) => {
  const padding = pipe(
    repeat(' '),
    join(''),
  )(count);

  return pipe(
    replace(/\n/g, `\n${padding}`),
    concat(padding),
    replace(/\s+$/, '\n'),
  )(string);
});

const indentYaml = curry((count, yaml) =>
  pipe(
    safeDump,
    indent(count),
  )(yaml),
);

const platformsToMetaMain = platforms =>
  reduce(
    (acc, p) => {
      const index = findIndex(propEq('name', p.distribution), acc);

      if (index >= 0) {
        // Acc already knows of that distro, we add codeName to the existing list
        acc[index].versions = append(p.codeName, acc[index].versions);
      } else {
        // Create the version and add the codeName
        acc = append({ name: p.distribution, versions: [p.codeName] }, acc);
      }
      return acc;
    },
    [],
    platforms,
  );

module.exports = {
  listPlatforms,
  capitalize,
  parseDeps,
  listVersions,
  moleculePlatforms,
  indent,
  indentYaml,
  platformsToMetaMain,
};

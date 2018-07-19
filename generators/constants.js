const PLATFORMS = {
  UBUNTU: [
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'trusty',
      versionNumber: '14.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'xenial',
      versionNumber: '16.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'bionic',
      versionNumber: '18.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'cosmic',
      versionNumber: '18.10',
      tags: ['future'],
    },
  ],
  DEBIAN: [
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'jessie',
      versionNumber: '8',
      tags: ['current'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'stretch',
      versionNumber: '9',
      tags: ['lts'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'buster',
      versionNumber: 'testing',
      tags: ['future'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'sid',
      versionNumber: 'unstable',
      tags: ['future'],
    },
  ],
};

const ANSIBLE_VERSIONS = [
  '1.5',
  '1.6',
  '1.7',
  '1.8',
  '1.9',
  '2.0',
  '2.1',
  '2.2',
  '2.3',
  '2.4',
  '2.5',
  '2.6',
];

const LICENSES = [
  '0BSD',
  'Apache 2.0',
  'BSD-3-Clause (a.k.a. New or Revised)',
  'BSD-2-Clause (a.k.a. Simplified or FreeBSD)',
  'GPL',
  'ISC',
  'LGPL (a.k.a. Library or Lesser GPL)',
  'MIT',
  'Mozilla Pulic License 2.0',
  'Common Development and Distribution License',
  'Eclipse Public License',
];

const URLS = {
  ISSUES: 'https://v.gd/fihumo',
  LICENSE_INFO: 'https://v.gd/afifeg',
  DEPENDENCIES_FORMAT: 'https://v.gd/hohufa',
};

module.exports = {
  ANSIBLE_VERSIONS,
  LICENSES,
  PLATFORMS,
  URLS,
};

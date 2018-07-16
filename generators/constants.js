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
      tags: ['oldstable'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'stretch',
      versionNumber: '9',
      tags: ['stable'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'buster',
      versionNumber: 'testing',
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'sid',
      versionNumber: 'unstable',
    },
  ],
  CENTOS: [
    {
      family: 'redhat',
      distribution: 'centos',
      versionNumber: '7',
    },
    {
      family: 'redhat',
      distribution: 'centos',
      versionNumber: '6',
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

module.exports = {
  PLATFORMS,
  ANSIBLE_VERSIONS,
};

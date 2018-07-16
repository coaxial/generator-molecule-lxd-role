const PLATFORMS = {
  UBUNTU: [
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'trusty',
      version: '14.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'xenial',
      version: '16.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'bionic',
      version: '18.04',
      tags: ['lts', 'current'],
    },
    {
      family: 'debian',
      distribution: 'ubuntu',
      codeName: 'cosmic',
      version: '18.10',
      tags: ['future'],
    },
  ],
  DEBIAN: [
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'jessie',
      version: '8',
      tags: ['oldstable'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'stretch',
      version: '9',
      tags: ['stable'],
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'buster',
      version: 'testing',
    },
    {
      family: 'debian',
      distribution: 'debian',
      codeName: 'sid',
      version: 'unstable',
    },
  ],
  CENTOS: [
    {
      family: 'redhat',
      distribution: 'centos',
      version: '7',
    },
    {
      family: 'redhat',
      distribution: 'centos',
      version: '6',
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

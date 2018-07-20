# generator-molecule-lxd-role
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

This Yeoman generator will create a new Ansible role with the necessary
configuration to test it using
[Molecule](https://molecule.readthedocs.io/en/latest/) on Travis CI (optional).
It will run the Molecule tests using LXD containers instead of Docker
containers.

## Why LXD instead of Docker

LXD containers run a full system including an init system out of the box and
are extremely close to the actual metal or VM hosts usually targetted by
Ansible. I find LXD containers much better suited at testing Ansible roles,
rather than shoe-horning additional systems into a Docker container to simulate
a real host.

LXD is more like a VM but with a container footprint. It's based on LXC and
it's great. To learn more, see [the official website](http://linuxcontainers.org/).

## Installation

First, install [Yeoman](http://yeoman.io) and generator-molecule-lxd-role using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-molecule-lxd-role
```

Then generate your new project:

```bash
yo molecule-lxd-role
```

## What will the folder structure look like

```
.
├── defaults
│   └── main.yml
├── files
├── .gitignore
├── handlers
│   └── main.yml
├── meta
│   └── main.yml
├── molecule
│   ├── create.yml
│   ├── default
│   │   ├── molecule.yml
│   │   ├── playbook.yml
│   │   └── tests
│   │       └── test_default.py
│   └── destroy.yml
├── README.md
├── tasks
│   └── main.yml
├── templates
├── .travis
│   └── setup.sh
├── .travis.yml
└── vars
    └── main.yml

11 directories, 14 files
```

## Issues

Open an issue on this repo. Questions are welcome too.

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [coaxial](https://64b.it)


[npm-image]: https://badge.fury.io/js/generator-molecule-lxd-role.svg
[npm-url]: https://npmjs.org/package/generator-molecule-lxd-role
[travis-image]: https://travis-ci.org/coaxial/generator-molecule-lxd-role.svg?branch=master
[travis-url]: https://travis-ci.org/coaxial/generator-molecule-lxd-role
[daviddm-image]: https://david-dm.org/coaxial/generator-molecule-lxd-role.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/coaxial/generator-molecule-lxd-role
[coveralls-image]: https://coveralls.io/repos/coaxial/generator-molecule-lxd-role/badge.svg
[coveralls-url]: https://coveralls.io/r/coaxial/generator-molecule-lxd-role

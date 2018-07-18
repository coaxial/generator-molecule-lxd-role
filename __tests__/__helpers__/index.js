'use strict';
const assert = require('yeoman-assert');

const testFileContents = ({
  filePath,
  expected,
  testDescription,
  assertAbsence = false,
}) => {
  it(`contains ${testDescription}`, () => {
    let method = 'fileContent';
    if (assertAbsence) {
      method = 'noFileContent';
    }

    assert[method](filePath, expected);
  });
};

module.exports = {
  testFileContents,
};

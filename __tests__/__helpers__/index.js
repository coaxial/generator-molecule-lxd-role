'use strict';
const assert = require('yeoman-assert');

const testFileContents = ({ filePath, expected, testDescription }) => {
  it(`contains ${testDescription}`, () => {
    assert.fileContent(filePath, expected);
  });
};

module.exports = {
  testFileContents,
};

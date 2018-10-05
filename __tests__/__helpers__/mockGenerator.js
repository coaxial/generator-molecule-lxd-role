var Generator = require('yeoman-generator');

const spy = jest.fn();
const mockGenerator = () =>
  class extends Generator {
    constructor(args, opts) {
      super(args, opts);
      spy(args, opts);
    }

    test() {
      // This method is required so that it doesn't complain about the
      // generator having no method to run. It doesn't do anything useful other
      // than that.
    }
  };

module.exports = {
  mockGenerator,
  spy,
};

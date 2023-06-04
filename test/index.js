/**
 * Test runner
 */

// Dependencies
const helpers = require("./../lib/helpers");
const assert = require("assert");

// Application logic for the test runner
_app = {};

// Container for the tests
_app.tests = {
  unit: require("./unit"),
};

// Assert that the getANumber function is returning a number
_app.tests.unit["helpers.getANumber should return a number"] = (done) => {
  const val = helpers.getANumber();
  assert.equal(typeof val, "number");
  done();
};

// Assert that the getANumber function is returning 1
_app.tests.unit["helpers.getANumber should return 1"] = (done) => {
  const val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

// Assert that the getANumber function is returning 2
_app.tests.unit["helpers.getANumber should return 2"] = (done) => {
  const val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

// Run all the tests, collecting the errors and successes
_app.runTests = () => {
  const errors = [];
  let successes = 0;
  const limit = _app.countTests();
  let counter = 0;
  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (let testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (() => {
            const tmpTestName = testName;
            const testValue = subTests[testName];
            // Call the test
            try {
              testValue(() => {
                // If it calls back without throwing, then it succeeded, so log it in green
                console.log("\x1b[32m%s\x1b[0m", tmpTestName);
                counter++;
                successes++;
                if (counter == limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (e) {
              // If it throws, then it failed, so capture the error thrown and log it in red
              errors.push({
                name: testName,
                error: e,
              });
              console.log("\x1b[31m%s\x1b[0m", tmpTestName);
              counter++;
              if (counter == limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

// Run the test
_app.runTests();

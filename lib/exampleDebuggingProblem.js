/**
 * Library that demonstrates something throwing when it's init() is called
 */

// Container
const example = {};

// Init function
example.init = () => {
  // This is an error created intentionally (bar is not defined)
  const foo = bar;
};

// Export the container
module.exports = example;

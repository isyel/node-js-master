/**
 *
 * Primary file
 */

// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");
const cli = require("./lib/cli");
const exampleDebuggingProblem = require("./lib/exampleDebuggingProblem");

// Declare the app
const app = {};

// Init function
app.init = () => {
  // Start the server
  debugger;
  server.init();
  // Start the workers
  workers.init();
  debugger;
  // Start the CLI, but make sure it starts last
  setTimeout(() => {
    cli.init();
  }, 50);

  // set foo at 1
  debugger;
  const foo = 1;
  console.log("Just assigned 1 to foo");
  debugger;

  // Increment foo
  debugger;
  foo++;
  console.log("Just incremented foo");
  debugger;

  // Square foo
  foo = foo * foo;
  console.log("Just squared foo");
  debugger;

  // convert foo to a string
  foo = foo.toString();

  // Call the init script that will throw
  exampleDebuggingProblem.init();
};

// Execute
app.init();

// Export the app
module.exports = app;

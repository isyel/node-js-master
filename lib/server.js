/**
 *
 * Server-related tasks
 */

// Dependencies

const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");
// var _data = require("./data");

// // TESTING
// // @TODO delete this
// _data.delete("test", "newFile", (err) => {
//   console.log("this was the error", err);
// });
var handlers = require("./handlers");
const helpers = require("./helpers");
const path = require("path");
const util = require("util");
const debug = util.debuglog("server");

// Instantiate the server module object
var server = {};

// @TODO get rid of this
// helpers.sendTwilioSms("8141841767", "Hello!", (err) => {
//   console.log("this was the error", err);
// });

// instantiate the http server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instantiate the https server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem")),
};
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload, contentType) => {
      // Determine the type of response (fallback to JSON)
      contentType = typeof contentType == "string" ? contentType : "json";

      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Convert the payload to a string
      let payloadString = "";

      // Return the response parts that are content-specific
      if (contentType == "json") {
        res.setHeader("Content-Type", "application/json");
        // Use the payload called back by the handler, or default to an empty object
        payload = typeof payload == "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      } else if (contentType == "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload == "string" ? payload : "";
      }

      res.writeHead(statusCode);
      // send the response
      res.end(payloadString);

      // If the response is 200, print green, otherwise print red
      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          `${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          `${method.toUpperCase()} /${trimmedPath} ${statusCode}`
        );
      }
    });
  });
};

// Define a request router
server.router = {
  "": handlers.index,
  "account/create": handlers.accountCreate,
  "account/edit": handlers.accountEdit,
  "account/deleted": handlers.accountDeleted,
  "session/create": handlers.sessionCreate,
  "session/deleted": handlers.sessionDeleted,
  "checks/all": handlers.checksList,
  "checks/create": handlers.checksCreate,
  "checks/edit": handlers.checksEdit,
  ping: handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "api/checks": handlers.checks,
};

// Init script
server.init = () => {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `The server is listening on port ${config.httpPort} in ${config.envName} mode`
    );
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      `The server is listening on port ${config.httpsPort} in ${config.envName} mode`
    );
  });
};

// Export the module
module.exports = server;

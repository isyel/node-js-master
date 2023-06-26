/**
 * Example HTTP2 client
 */

// Dependencies
const http2 = require("http2");

// Create client
const client = http2.connect("http://localhost:6000");

// Create a request
const req = client.request({
  ":path": "/",
});

// When a message is received, add the pieces of it together until you reach the end
let str = "";
req.on("data", (chunk) => {
  str += chunk;
});

// When the message ends, log it out
req.on("end", () => {
  console.log(str);
  client.close();
});

// End the request
req.end();

// Compare this snippet from misc\http2-client.js:
// /**
//  *  Example HTTP2 client
//  */

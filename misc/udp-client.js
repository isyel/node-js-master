/**
 * Example UDP client
 * Sending a message to a UDP server on port 6000
 */

// Dependencies
const dgram = require("dgram");

// Create a client
const client = dgram.createSocket("udp4");

// Define the message and pull it into a buffer
const messageString = "This is a message";
const messageBuffer = Buffer.from(messageString);

// Send off the message
client.send(messageBuffer, 6000, "localhost", (err) => {
  client.close();
});

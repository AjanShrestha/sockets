var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X')); // seconds since, Jan 1 1970
console.log(now.format('x')); // milliseconds
console.log(now.valueOf());

var timestamp = 1504418518254;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));

// now.subtract(1, 'year');

// console.log(now.format());
// console.log(now.format('MMM Do YYYY h:mm a'));
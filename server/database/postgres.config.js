// This file stores DB constants. The URL is required in so nobody steals it.
var url = require('./postgres.url.js') || null;

// Postgres schemata are like namespaces within the single database.
// These allow us to have a parallel test schema that we can constantly
// refresh, without affecting any live data in the main schema.
var mainSchema = 'moodlet';
var testSchema = 'moodlet_test';

module.exports = {
  url: url,
  mainSchema: mainSchema,
  testSchema: testSchema
};
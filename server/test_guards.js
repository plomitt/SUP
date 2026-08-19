// node test_guards.js -- guards that stand between a crafted request body and the database
const assert = require('assert');
const { containsObject, UPDATABLE_USER_FIELDS } = require('./additional');

// mongo operator objects must never reach a query filter
assert.strictEqual(containsObject({$ne: null}), true);
assert.strictEqual(containsObject(['add', {$ne: null}, 'uid', 'sid']), true);
assert.strictEqual(containsObject([['math', {$gt: ''}]]), true);

// ordinary payloads must still pass
assert.strictEqual(containsObject(['signin', 'a@b', 'Passw0rd!']), false);
assert.strictEqual(containsObject(['subjectsCanHelp', ['math', 'physics']]), false);
assert.strictEqual(containsObject([null, 42, true]), false);

// privilege fields must not be writable through /updateuserpreferences
for (const field of ['moderator', 'verified', 'banned', 'accessLevel', 'id', 'usersRespondedToUser']) {
  assert.ok(!UPDATABLE_USER_FIELDS.includes(field), `${field} must not be updatable`);
}

// the fields the preferences page actually sends must still be writable
for (const field of ['name', 'email', 'password', 'pfp', 'bio', 'phone', 'grade', 'subjectsCanHelp', 'subjectsNeedHelp']) {
  assert.ok(UPDATABLE_USER_FIELDS.includes(field), `${field} must stay updatable`);
}

console.log('guards ok');

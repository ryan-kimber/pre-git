#!/usr/bin/env node

'use strict';

const ggit = require('@formhero/ggit-fork');
const preGit = require('@formhero/pre-git-fork');
const la = require('lazy-ass');
const check = require('check-more-types');
const log = require('debug')('pre-git');

const wizard = preGit.wizard();
if (!wizard) {
  log('no commit message wizard defined');
  process.exit(0);
}

log('found commit message wizard with name', wizard.name);

la(check.fn(wizard.validate),
  'missing wizard validate method,', Object.keys(wizard));
la(check.fn(preGit.printError),
  'missing preGit.printError,', Object.keys(preGit));

function checkMessage(msg) {
  log('checking commit message:', msg);
  const isValid = wizard.validate(msg);
  if (!isValid) {
    log('invalid commit message', msg);
    process.exit(-1);
  }
  log('valid git commit message');
}

ggit.commitMessage()
  .then((msg) => {
    return process.env.TEST_GIT_MESSAGE || msg;
  })
  .then(checkMessage)
  .catch((err) => {
    // assuming each validator printed the errors?
    console.error(err);
    process.exit(-1);
  })
  .done();

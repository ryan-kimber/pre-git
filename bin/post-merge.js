#!/usr/bin/env node

'use strict';

const label = 'post-merge';
const run = require('@formhero/pre-git-fork').run;
const runTask = run.bind(null, label);

runTask()
  .done();

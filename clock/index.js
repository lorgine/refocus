/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * clock/index.js
 *
 * Defines all the scheduled processes to execute on regular intervals.
 *
 * If a separate clock dyno is enabled ("enableClockProcess"), this is the main
 * module to start the clock process. To just start the clock process,
 * use "npm run start-clock". To start both the web and the clock processes
 * locally, use "heroku local".
 *
 * If a separate clock dyno is NOT enabled, this module is just loaded from
 * inside the main web process.
 */
const conf = require('../config');
if (conf.newRelicKey) {
  require('newrelic');
}

const featureToggles = require('feature-toggles');
const kueStatsActivityLogs = require('./scheduledJobs/kueStatsActivityLogs');
const persistSampleStoreJob = require('./scheduledJobs/persistSampleStoreJob');
const queueStatsActivityLogs =
  require('./scheduledJobs/queueStatsActivityLogs');
const sampleTimeoutJob = require('./scheduledJobs/sampleTimeoutJob');
const jobCleanup = require('./scheduledJobs/jobCleanup');

/*
 * Add all the scheduled work here.
 */
setInterval(sampleTimeoutJob.enqueue, conf.checkTimeoutIntervalMillis);

// If redis sample store feature is enabled, schedule persist to db
if (featureToggles.isFeatureEnabled('enableRedisSampleStore')) {
  setInterval(persistSampleStoreJob.enqueue,
    conf.persistRedisSampleStoreMilliseconds);
}

// If enableKueStatsActivityLogs is true then write log
if (featureToggles.isFeatureEnabled('enableKueStatsActivityLogs')) {
  setInterval(kueStatsActivityLogs.execute,
    conf.queueStatsActivityLogsInterval);
}

// If queueStatsActivityLogs is true then write log
if (featureToggles.isFeatureEnabled('enableQueueStatsActivityLogs')) {
  setInterval(queueStatsActivityLogs.execute,
    conf.queueStatsActivityLogsInterval);
}

// Clean up completed jobs
setInterval(jobCleanup.execute, conf.JOB_REMOVAL_INTERVAL_SECONDS * 1000);

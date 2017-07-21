/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * view/rooms/app.js
 *
 * When page is loaded we take all the bots queried and processed
 * to have their UI appended to the page.
 *
 */

import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
const AdmZip = require('adm-zip');
const GET_BOTS = '/v1/bots';
const REQ_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  Expires: '-1',
  'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1,private',
};

/**
 * @param {String} url The url to get from
 * @returns {Promise} For use in chaining.
 */
function getPromiseWithUrl(url) {
  return new Promise((resolve, reject) => {
    request.get(url)
    .set(REQ_HEADERS)
    .end((error, response) => {
      // reject if error is present, otherwise resolve request
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
} // getPromiseWithUrl

/**
 * Create DOM elements for each of the files in the bots zip.
 *
 * @param {Object} bots - The ui buffer saved in the bots ui
 */
function parseBots(bots) {
  // Unzip bots
  const zip = new AdmZip(new Buffer(bots.data));
  const zipEntries = zip.getEntries();

  // Get the bots section of the page
  const botsContainer = document.getElementById('bots');
  const botContainer = document.createElement('div');
  const botScript = document.createElement('script');

  for (let i = 0; i < zipEntries.length; i++) {
    if (zipEntries[i].name === 'index.html') {
      botContainer.innerHTML = zip.readAsText(zipEntries[i]);
      botsContainer.appendChild(botContainer);
    } else {
      botScript.appendChild(
        document.createTextNode(zip.readAsText(zipEntries[i]))
      );
      document.body.appendChild(botScript);
    }
  }
} // parseBots

getPromiseWithUrl(GET_BOTS)
.then((res) => {
  for (let i = 0; i < res.body.length; i++) {
    parseBots(res.body[i].ui);
  }
});

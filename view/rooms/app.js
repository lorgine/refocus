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

const getLens = getPromiseWithUrl(GET_BOTS)
    .then((res) => {
      handleLibraryFiles(res.body[0].ui);
    });

function handleLibraryFiles(lib) {
	console.log(lib);
const zip = new AdmZip(lib);
    const zipEntries = zip.getEntry();
  	console.log(zipEntries);

	console.log(lib.data);
  	const zip2 = new AdmZip(lib.data);
    const zipEntries2 = zip2.getEntries();

  	console.log(zipEntries2);
const LENS_LIBRARY_REX = /(?:\.([^.]+))?$/;
  //const lensScript = document.createElement('script');
  for (const filename in lib) {
  	console.log(filename);
    const ext = (LENS_LIBRARY_REX.exec(filename)[1] || '').toLowerCase();

  	//console.log(ext);
   /* if (filename === 'lens.js') {
      lensScript.appendChild(document.createTextNode(lib[filename]));
    } else if (ext === 'css') {
      injectStyleTag(lib, filename);
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      const image = new Image();
      image.src = 'data:image/' + ext + ';base64,' + lib[filename];
      document.body.appendChild(image);
    } else if (ext === 'js') {
      const s = document.createElement('script');
      s.appendChild(document.createTextNode(lib[filename]));
      document.body.appendChild(s);
    }*/
  }

  /*
   * Note: this 'lens.js' script should always get added as the LAST script
   * since it may reference things defined in the other scripts.
   */
  //document.body.appendChild(lensScript);
} // handleLibraryFiles

const botsContainer = document.getElementById('bots');
const botContainer = document.createElement('div');
botContainer.innerHTML = `<a href="http://google.com/">test</a>`;
botsContainer.appendChild(botContainer);

const botScript = document.createElement('script');
botScript.appendChild(document.createTextNode('alert("test");'));

document.body.appendChild(botScript);
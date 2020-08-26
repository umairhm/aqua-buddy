// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // Ask for notification permission
  // If permission granted
  // Enable the extension
  // And
  // Set a storage variable with default configuration
  chrome.notifications.create(
    null,
    {
      type: 'basic',
      iconUrl: 'images/aqua-buddy-512.png',
      title: 'Hello',
      message: 'World!'
    },
    (notificationId) => {
      console.log(notificationId);
    }
  );
});
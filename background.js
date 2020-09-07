// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const hours = [];

const defaults = {
  doNotDisturb: false,
  frequency: 30,
  quietHours: {
    from: '12:00 AM',
    to: '08:00 AM'
  }
};

chrome.runtime.onInstalled.addListener(function () {
  // Send a welcome notification after installation
  chrome.notifications.create(
    null,
    {
      type: "basic",
      iconUrl: "images/aqua-buddy-512.png",
      title: "Hey there!!!",
      message: "I'm your buddy, and I'll make sure that you stay hydrated!",
    }
  );

  // Check if config exists in sync storage
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    // If sync storage returns nothing, set to defaults
    if (!result.aquaBuddyConfig) {
      chrome.storage.sync.set({'aquaBuddyConfig': defaults});
    }
  });
});

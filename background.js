// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const defaultConfig = {
  doNotDisturb: false,
  frequency: 1,
  quietHours: {
    from: 0,
    to: 8
  }
};

function createBasicNotification(message, title, imageUrl) {
  chrome.notifications.create(
    null,
    {
      type: "basic",
      iconUrl: "images/aqua-buddy-512.png",
      title: title || "Hey there! I'm Aqua Buddy 😊",
      message: message,
      imageUrl: imageUrl
    }
  );
}

function sendWelcomeNotification() {
  createBasicNotification(
    "I'm your friend 💙 and I'm here to help you stay hydrated!"
  );
}

function initializeConfigurationFromStorage() {
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    // If sync storage returns nothing, set to defaultConfig
    let aquaBuddyConfig = result.aquaBuddyConfig;
    if (!aquaBuddyConfig) {
      aquaBuddyConfig = defaultConfig;
      chrome.storage.sync.set({'aquaBuddyConfig': aquaBuddyConfig});
    }

    setAlarmForNextNotification(aquaBuddyConfig);
  });
}

function initializeListenerForStorageChanges() {
  chrome.storage.onChanged.addListener(function(changes, area) {
    const aquaBuddyConfig =  changes.aquaBuddyConfig;
    if (area === 'sync' && aquaBuddyConfig && aquaBuddyConfig.oldValue) {
      if (aquaBuddyConfig.newValue.doNotDisturb) {
        chrome.alarms.clear('aqua-buddy');
      } else {
        setAlarmForNextNotification(aquaBuddyConfig.newValue);
      }
    }
  });
}

function setAlarmForNextNotification(aquaBuddyConfig) {
  // TODO: Call getNextAlarmTime to get calculated value for "when"
  chrome.alarms.create('aqua-buddy', {
    periodInMinutes: aquaBuddyConfig.frequency
  });

  chrome.alarms.onAlarm.addListener(function() {
    onAlarmHandler(aquaBuddyConfig);
  });
}

function onAlarmHandler(aquaBuddyConfig) {
  if (!aquaBuddyConfig.doNotDisturb) {
    const now = new Date();

    const quietHoursFrom = aquaBuddyConfig.quietHours.from;
    const quietHoursTo = aquaBuddyConfig.quietHours.to;

    // If "from" is smaller than "to", it means both are in same day
    // If "from" is greater than "to", it means "from" is in previous day

    // TODO: Show notification only if current time is outside of quiet hours

    createBasicNotification(
      "It's time to drink some water 💧 and keep yourself hydrated 💪"
    );
  }
}

chrome.runtime.onInstalled.addListener(function () {
  // TODO: remove this line
  chrome.storage.sync.remove(['aquaBuddyConfig']);
  sendWelcomeNotification();

  initializeConfigurationFromStorage();

  initializeListenerForStorageChanges();
});

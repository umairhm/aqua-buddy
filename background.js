// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const defaultConfig = {
  doNotDisturb: false,
  frequency: 30,
  quietHours: {
    from: 20,
    to: 8
  }
};

function createBasicNotification(message, title, imageUrl) {
  chrome.notifications.create(
    `aqua-buddy-${Date.now()}`,
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

function setAlarmForNextNotification(aquaBuddyConfig) {
  chrome.alarms.create('aqua-buddy', {
    periodInMinutes: aquaBuddyConfig.frequency
  });
}

function onAlarmHandler() {
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    // If sync storage returns nothing, set to defaultConfig
    let aquaBuddyConfig = result.aquaBuddyConfig;

    if (aquaBuddyConfig && !aquaBuddyConfig.doNotDisturb) {
      const currentHour = (new Date()).getHours();

    const quietHoursFrom = aquaBuddyConfig.quietHours.from;
    const quietHoursTo = aquaBuddyConfig.quietHours.to;

    if (
      (
        quietHoursFrom > quietHoursTo &&
        currentHour <= quietHoursFrom &&
        currentHour >= quietHoursTo
      ) ||
      (
        quietHoursFrom < quietHoursTo &&
        (
          currentHour < quietHoursFrom || 
          currentHour >= quietHoursTo
        )
      )
    ) {
      createBasicNotification(
        "It's time to drink some water 💧 and keep yourself hydrated 💪"
      );
    }
    }
  });
}

chrome.runtime.onInstalled.addListener(function () {
  sendWelcomeNotification();

  initializeConfigurationFromStorage();
});

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

chrome.alarms.onAlarm.addListener(function() {
  onAlarmHandler();
});

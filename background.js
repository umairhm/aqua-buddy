// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const defaults = {
  doNotDisturb: false,
  frequency: 1,
  quietHours: {
    from: '12:00 AM',
    to: '08:00 AM'
  }
};

function createBasicNotification(title, message, imageUrl) {
  chrome.notifications.create(
    null,
    {
      type: "basic",
      iconUrl: "images/aqua-buddy-512.png",
      title: title,
      message: message,
      imageUrl: imageUrl
    }
  );
}

function sendWelcomeNotification() {
  createBasicNotification(
    "Hey there! I'm Aqua Buddy 😊",
    "I'm your friend 💙 and I'm here to help you stay hydrated!"
  );
}

function initializeConfigurationFromStorage() {
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    // If sync storage returns nothing, set to defaults
    if (!result.aquaBuddyConfig) {
      chrome.storage.sync.set({'aquaBuddyConfig': defaults});
      setAlarmForNextNotification(defaults);
    } else {
      setAlarmForNextNotification(result.aquaBuddyConfig);
    }
  });
}

function initializeListenerForStorageChanges() {
  chrome.storage.onChanged.addListener(function(changes, area) {
    console.log('changes: ', JSON.stringify(changes));
    console.log('area: ', area);
  });
}

function setAlarmForNextNotification(aquaBuddyConfig) {
  const alarmTime = getNextAlarmTime(aquaBuddyConfig.frequency);

  chrome.alarms.create('aqua-buddy', {
    when: alarmTime,
    periodInMinutes: aquaBuddyConfig.frequency
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log(alarm);
  });
}

function getNextAlarmTime(frequency) {
  // based on selected frequency, calculate next alarm time
  // if frequency is 15 minutes
  //  set alarm for next 15 minutes point (00, 15, 30, 45)
  // if frequency is 30 minutes
  //  set alarm for next 30 minutes point (00, 30)
  // if frequency is 45 minutes
  //  set alarm for next 45 minutes break
  //  pick next 15 minutes point and start alarm timer
  // if frequency is 60 minutes
  //  pick the next hour point and start alarm timer

  // switch (frequency) {
  //   case 15:
  //     break;
  //   case 30:
  //     break;
  //   case 45:
  //     break;
  //   case 60:
  //     break;
  // }

  return Date.now() + (frequency * 60);
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.remove(['aquaBuddyConfig']);
  sendWelcomeNotification();

  initializeConfigurationFromStorage();

  initializeListenerForStorageChanges();
});

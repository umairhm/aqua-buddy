const selectedFrequencyButtonClasses = ['bg-blue-500', 'hover:bg-blue-700', 'text-white'];
const unselectedFrequencyButtonClasses = ['border', 'border-white', 'hover:border-gray-200', 'text-blue-500', 'hover:bg-gray-200']
const frequencyButtons = ['button_15', 'button_30', 'button_45', 'button_60'];

function getHours() {
  const _hours = [];
  for (let hour = 0; hour <= 23; hour++) {
    const ampm = hour > 11 ? 'PM' : 'AM';
    
    let hourlyTime = hour > 12 ? hour - 12 : hour;
    hourlyTime = hourlyTime === 0 ? 12 : hourlyTime;
    hourlyTime = hourlyTime < 10 ? '0' + hourlyTime : hourlyTime;

    _hours.push(`${hourlyTime}:00 ${ampm}`);
  }
  return _hours;
}

function populateHours(_select, _hours, _selectedOption) {
  for (i = 0; i < _hours.length; i++) {
    let option = document.createElement('option');
    const hour = _hours[i];
    option.text = hour;
    option.value = hour;
    option.selected = hour === _selectedOption;
    _select.append(option);
  }
}

function setupInterfaceWithConfig(_aquaBuddyConfig) {
  // Set Do Not Disturb toggle switch
  document.getElementById('input_doNotDisturb').checked = _aquaBuddyConfig.doNotDisturb;

  // Set frequency buttons
  for (let i = 0; i < frequencyButtons.length; i++) {
    const button = document.getElementById(frequencyButtons[i]);
    if (_aquaBuddyConfig.frequency === +button.attributes['data-frequency'].value) {
      button.classList.add(...selectedFrequencyButtonClasses);
    } else {
      button.classList.add(...unselectedFrequencyButtonClasses);
    }
  }

  // Get quite hours drop-downs 
  const quietHoursFrom = document.getElementById('quietHoursFrom');
  const quietHoursTo = document.getElementById('quietHoursTo');

  // Populate hours for display
  const hours = getHours();

  // Populate options in the quite hours drop-downs
  populateHours(quietHoursFrom, hours, _aquaBuddyConfig.quietHours.from);
  populateHours(quietHoursTo, hours, _aquaBuddyConfig.quietHours.to);
}

// Initialize the popup window.
document.addEventListener('DOMContentLoaded', function () {
  // Get aquaBuddyConfig from storage
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    setupInterfaceWithConfig(result.aquaBuddyConfig);
  });
});
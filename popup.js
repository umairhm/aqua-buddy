const selectedFrequencyButtonClasses = ['selected', 'bg-blue-500', 'hover:bg-blue-700', 'text-white'];
const unselectedFrequencyButtonClasses = ['border', 'border-white', 'hover:border-gray-200', 'text-blue-500', 'hover:bg-gray-200']
const frequencyButtons = ['button_15', 'button_30', 'button_45', 'button_60'];

let aquaBuddyConfig = {};

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

function setDoNotDisturb() {
  // Set do not disturb toggle switch
  input_doNotDisturb = document.getElementById('input_doNotDisturb');
  input_doNotDisturb.checked = aquaBuddyConfig.doNotDisturb;
  input_doNotDisturb.onchange = doNotDisturbChangeHandler;
}

function doNotDisturbChangeHandler(e) {
  e.preventDefault();
  updateConfigInStorage({...aquaBuddyConfig, doNotDisturb: e.target.checked });
}

function setFrequencyButtons() {
  for (let i = 0; i < frequencyButtons.length; i++) {
    const button = document.getElementById(frequencyButtons[i]);
    const frequencyValue = +button.attributes['data-frequency'].value;
    if (aquaBuddyConfig.frequency === frequencyValue) {
      button.classList.add(...selectedFrequencyButtonClasses);
    } else {
      button.classList.add(...unselectedFrequencyButtonClasses);
    }
    button.onclick = frequencyButtonClickHandler;
  }
}

function frequencyButtonClickHandler(e) {
  e.preventDefault();
  
  // Get current selected frequency button
  const selectedButton = document.querySelector('button.selected');
  
  // Get clicked frequency button
  const clickedButton = e.target;

  // Update config
  const frequencyValue = +e.target.attributes['data-frequency'].value;
  updateConfigInStorage({...aquaBuddyConfig, frequency: frequencyValue });

  // Update styles
  selectedButton.classList.remove(...selectedFrequencyButtonClasses);
  selectedButton.classList.add(...unselectedFrequencyButtonClasses);

  clickedButton.classList.add(...selectedFrequencyButtonClasses);
  clickedButton.classList.remove(...unselectedFrequencyButtonClasses);
}

function setQuietHours() {
  // Get quite hours drop-downs 
  const quietHoursFrom = document.getElementById('quietHoursFrom');
  const quietHoursTo = document.getElementById('quietHoursTo');

  // Populate hours for display
  const hours = getHours();

  // Populate options in the quite hours drop-downs
  populateHours(quietHoursFrom, hours, aquaBuddyConfig.quietHours.from);
  populateHours(quietHoursTo, hours, aquaBuddyConfig.quietHours.to);

  quietHoursFrom.onchange = quietHoursChangeHandler;
  quietHoursTo.onchange = quietHoursChangeHandler;
}

function quietHoursChangeHandler(e) {
  e.preventDefault();

  const changedSelect = e.target;
  console.log(changedSelect);  
  if (changedSelect.id === 'quietHoursFrom') {
    updateConfigInStorage({...aquaBuddyConfig, quietHours: { from: changedSelect.value } });
  } else {
    updateConfigInStorage({...aquaBuddyConfig, quietHours: { to: changedSelect.value } });
  }
}

function setupInterfaceWithConfig() {
  setDoNotDisturb();

  setFrequencyButtons();

  setQuietHours();
}

function updateConfigInStorage(config) {
  chrome.storage.sync.set({'aquaBuddyConfig': config});
}

// Initialize the popup window.
document.addEventListener('DOMContentLoaded', function () {
  // Get aquaBuddyConfig from storage and attach event listeners
  chrome.storage.sync.get(['aquaBuddyConfig'], function(result) {
    aquaBuddyConfig = result.aquaBuddyConfig;
    setupInterfaceWithConfig();
  });
});
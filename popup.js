const selectedTimeButtonClasses = ['selected', 'bg-blue-500', 'hover:bg-blue-700', 'text-white'];
const unselectedTimeButtonClasses = ['unselected', 'border', 'border-white', 'hover:border-gray-200', 'text-blue-500', 'hover:bg-gray-200'];
document.addEventListener('DOMContentLoaded', function() {
  const timeButtons = document.getElementsByClassName('time-button');
  let isTimeButtonClicked = false;
  let timeout = -1;
  for (let i = 0; i < timeButtons.length; i++) {
    const timeButton = timeButtons[i];
    timeButton.addEventListener('click',() => {
      if (isTimeButtonClicked) {
        clearTimeout(timeout);
        document.getElementById('success').classList.add('hidden', 'opacity-0');
      }

      isTimeButtonClicked = true;
      // Fake loader for 1000ms
      document.getElementById('loader').classList.remove('hidden', 'opacity-0');
      setTimeout(() => {
        const previousSelected = document.getElementsByClassName('selected')[0];
        previousSelected.classList.remove(...selectedTimeButtonClasses);
        previousSelected.classList.add(...unselectedTimeButtonClasses);
        timeButton.classList.remove(...unselectedTimeButtonClasses);
        timeButton.classList.add(...selectedTimeButtonClasses);
        document.getElementById('loader').classList.add('hidden', 'opacity-0');
        document.getElementById('success').classList.remove('hidden');
        // delay showing success for 100ms to make the animation work
        setTimeout(() => {
          document.getElementById('success').classList.remove('opacity-0');
          timeout = setTimeout(() => {
            document.getElementById('success').classList.add('hidden', 'opacity-0');
            isTimeButtonClicked = false;
          }, 5000);
        }, 100);
      }, 1000);
    });
  }
});
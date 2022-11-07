let count = 1;
count++;
console.log(count);

document.body.style.background = '#71C562';

chrome.notifications.create({
  type: 'basic',
  iconUrl: browser.runtime.getURL('icons/cake-96.png'),
  title: 'Time for cake!',
  message: 'Something something cake',
});

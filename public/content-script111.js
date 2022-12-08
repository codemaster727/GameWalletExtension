// import { browser } from 'webextension-polyfill-ts';

// // let count = 1;
// // count++;

// // document.body.style.background = '#09a33a';

// // chrome.notifications.create({
// //   type: 'basic',
// //   iconUrl: browser.runtime.getURL('icons/cake-96.png'),
// //   title: 'Time for cake!',
// //   message: 'Something something cake',
// // });

// const button = document.createElement('button');
// button.innerHTML = 'here1';
// button.addEventListener('click', () => {
//   // chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
//   //   tabURL = tabs[0].id;
//   //   console.log('URL from get-url.js', tabURL);
//   browser.runtime.sendMessage(tabURL, 'OpenPopup');
//   // });
// });

// document.body.appendChild(button);

// chrome.runtime.onMessage.addListener((request) => {
//   console.log('rcvd');
//   if (request == 'OpenPopup') {
//     chrome.windows.create(
//       {
//         url: `index.html`,
//         type: `popup`,
//         focused: true,
//         width: 400,
//         height: 600,
//         top: 0,
//       },
//       () => {
//         console.log(`Opened popup!`);
//       },
//     );
//   }
// });

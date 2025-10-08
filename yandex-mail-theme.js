// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @updateURL    https://raw.githubusercontent.com/droooney/custom-scripts/refs/heads/master/yandex-mail-theme.js
// @downloadURL  https://raw.githubusercontent.com/droooney/custom-scripts/refs/heads/master/yandex-mail-theme.js
// @description  try to take over the world!
// @author       You
// @include      https://mail.yandex.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.com
// @grant        none
// ==/UserScript==

(() => {
  const match = window.matchMedia('(prefers-color-scheme: dark)');

  const getSettingsButton = () => {
    return document.querySelector('button[data-testid="settings-button"]');
  };

  const poll = (checker) => {
    return new Promise((resolve, reject) => {
      let tries = 0;

      const check = () => {
        try {
          if (++tries > 100) {
            throw new Error('Timeout');
          }

          const result = checker();

          if (result) {
            resolve(result);
          } else {
            setTimeout(check, 50);
          }
        } catch (err) {
          reject(err);
        }
      };

      check();
    });
  };

  const setTheme = async () => {
    const settingsButton = await poll(getSettingsButton);
    const isDarkMode = match.matches;

    settingsButton.click();

    await poll(() => document.querySelector('[data-testid="settings-popup"]'));

    const cards = [...document.querySelectorAll('[class*="ThemesWithScope__card"]')];
    const card = isDarkMode ? cards.at(2) : cards.at(0);

    card?.click();
    settingsButton.click();
  };

  setTheme();

  match.addEventListener('change', setTheme);
})();

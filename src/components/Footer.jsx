import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import React from 'react';

export default function Footer() {
  useEffect(() => {
    themeChange(false)
  }, [])

  const themes = ['light', 'dark', 'crimson'];

  return (
    <footer className="custom-content footer bg-base-200">
      <div className="dark-mode-toggle-container">
        <div id="theme-switcher-form">
          {themes.map((theme, index) => (
            <div data-theme={theme} className="themeChoice" key={index}>
              <input
                type="radio"
                id={`${theme}-theme`}
                name="theme-choice"
                value={`${theme}-theme`}
                selected="selected"
              />
            <label className={index === 0 ? "isActivelol" : ""} data-act-class="isActivelol" data-set-theme={theme} htmlFor="light-theme"></label>
            </div>
          ))}
        </div>
      </div>
      <p>Built by Cal Henderson. <a href="https://github.com/iamcal/enchant-order">Source on Github</a></p>
    </footer>
  );
};

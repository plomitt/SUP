import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { ThemeProvider } from 'styled-components';
import themes from './utils/themes.js';
import Root from './components/root.js';
import { router } from './utils/router.js';
import { createBrowserHistory } from 'history';

let state = {
  page: 'landing'
};

function setUpLangAndTheme() {
  const storedTheme = localStorage.getItem('theme');
  const storedLanguage = localStorage.getItem('language');

  if (storedTheme === null) {
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDarkTheme === true) {
      changeTheme('dark');
    } else {
      changeTheme('light');
    }
  } else {
    changeTheme(storedTheme);
  }

  if (storedLanguage === null) {
    const prefersEn = navigator.language.includes('en');

    if (prefersEn === true) {
      changeLanguage('en');
    } else {
      changeLanguage('ru');
    }

  } else {
    changeLanguage(storedLanguage);
  }
}

function changeLanguage(languageName) {
  state.language = languageName;

  document.querySelector('html').setAttribute('lang', languageName);
  localStorage.setItem('language', languageName);
}

function changeTheme(themeName) {
  const theme = themes[themeName];

  document.getElementById('body').style.backgroundColor = theme.primaryColor;
  document.getElementById('body').style.color = theme.textColor;

  state.theme = theme;

  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme.accentColor);
  localStorage.setItem('theme', themeName);
}

setUpLangAndTheme();

router(window.location.href)
.then(res => {
  state.page = res.page;
  render();
})

function render() {
  console.log(state);
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={state.theme}>
          <Root page={state.page} language={state.language} changeTheme={changeTheme} changeLanguage={changeLanguage} />
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
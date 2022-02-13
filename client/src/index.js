import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { ThemeProvider } from 'styled-components';
import themes from './utils/themes.js';
import Root from './components/root.js';
import { router } from './utils/router.js';
import { createBrowserHistory } from 'history';
import { updateUserData } from './utils/additional.js';

let history = createBrowserHistory();

let state = {
  page: 'landing',
  language: 'en',
  theme: themes['dark']
};

function setUpLangAndTheme() {
  const storedTheme = localStorage.getItem('theme');
  const storedLanguage = localStorage.getItem('language');

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
}

function changeLanguage(languageName) {
  state.language = languageName;

  document.querySelector('html').setAttribute('lang', languageName);
  localStorage.setItem('language', languageName);
  render();
}

function changeTheme(themeName) {
  const theme = themes[themeName];
  state.theme = theme;

  document.getElementById('body').style.backgroundColor = theme.primaryColor;
  document.getElementById('body').style.color = theme.textColor;

  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme.accentColor);
  localStorage.setItem('theme', themeName);
  render();
}

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={state.theme}>
          <Root page={state.page} destination={state.destination} error={state.error} history={history} language={state.language} changeTheme={changeTheme} changeLanguage={changeLanguage} />
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

function changePage(href) {
  router(href, history)
  .then(res => {
    state.page = res.page;

    if (res.page === 'authorization') {
      state.destination = res.destination;
    }

    if (res.page === 'error') {
      state.error = res.error
    }


    render();
  })
}

setUpLangAndTheme();
changePage(window.location.href);
updateUserData(history);


window.addEventListener('hashchange', changePage(window.location.href));
history.listen(({action, location}) => {
  changePage(location.pathname);
});
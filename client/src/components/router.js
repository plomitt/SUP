import React from 'react';
import themes from './themes';
import LandingPage from './landing_page';
import SigninPage from './signin_page';
import SignupPage from './signup_page';
import AuthorizationPage from './authorization_page';
import ErrorPage from './error_page';
import UserPreferencesPage from './user_pref_page';
import WorkPage from './work_page';
import { ThemeProvider } from 'styled-components';
import { checkIfUserSignedIn, updateUserData } from './additional';


class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.controlState = this.controlState.bind(this);
    this.redirect = this.redirect.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.setUpLangAndTheme = this.setUpLangAndTheme.bind(this);

    
    this.state = {
      page: 'landing',
      destination: '',
      authorized: false,
      error: 'none',
      theme: themes.light,
      language: 'en'
    };
  }

  componentDidMount() {
    updateUserData();
    
    window.addEventListener('hashchange', this.redirect(window.location.href));
  }

  setUpLangAndTheme() {
    const storedTheme = localStorage.getItem('theme');
    const storedLanguage = localStorage.getItem('language');

    if (storedTheme === null) {
      const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (prefersDarkTheme === true) {
        this.changeTheme('dark');
      } else {
        this.changeTheme('light');
      }
    } else {
      this.changeTheme(storedTheme);
    }

    if (storedLanguage === null) {
      const prefersEn = navigator.language.includes('en');

      if (prefersEn === true) {
        this.changeLanguage('en');
      } else {
        this.changeLanguage('ru');
      }

    } else {
      this.changeLanguage(storedLanguage);
    }
  }

  changeLanguage(languageName) {
    this.setState({
      language: languageName
    })

    document.querySelector('html').setAttribute("lang", languageName);
    localStorage.setItem('language', languageName);
  }

  changeTheme(themeName) {
    const theme = themes[themeName];

    document.getElementById("body").style.backgroundColor = theme.primaryColor;
    document.getElementById("body").style.color = theme.textColor;

    this.setState({
      theme: theme
    })

    document.querySelector('meta[name="theme-color"]').setAttribute("content", theme.accentColor);
    localStorage.setItem('theme', themeName);
  }

  controlState(state) {
    this.setState(state);
  }

  redirect(href) {
    const context = this;
    const array = href.split('/')
    const destination = array[array.length - 1].split('?')[0];
    const pages = [ '', 'signin', 'signup', 'authorization', 'userpreferences', 'work']
    const protectedPages = ['userpreferences'];

    
    checkIfUserSignedIn()
    .then(isSignedIn => {
      if (isSignedIn === 'error') {
        context.setState({
          page: 'error',
          error: '500'
        })
      } else {
        if (destination === '') {
          context.setState({
            page: 'landing'
          })
        } else if (!pages.includes(destination)) {
          context.setState({
            page: 'error',
            error: '404'
          })
        } else if (isSignedIn === true && destination !== 'signin' && destination !== 'signup') {
          if (protectedPages.includes(destination) === true) {
            if (context.state.authorized === true) {
              context.setState({
                page: destination
              })
            } else {
              context.setState({
                page: 'authorization',
                destination: destination
              })
            }
          } else {
            context.setState({
              page: destination
            })
          }
        } else if (isSignedIn === true && (destination === 'signin' || destination === 'signup')) {
          window.location.href = '/work'
        } else if (isSignedIn === false && destination !== 'signin' && destination !== 'signup') {
          window.location.href = '/signin'
        } else if (isSignedIn === false && (destination === 'signin' || destination === 'signup')) {
          context.setState({
            page: destination
          })
        }
      }

    })
  }

  render() {
    const page = this.state.page;
    const context = this;
    let toShow;

    if (page === 'landing') {
      toShow = <LandingPage language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme}/>
    }

    if (page === 'signin') {
      toShow = <SigninPage language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme}/>
    }

    if (page === 'signup') {
      toShow = <SignupPage language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme}/>
    }

    if (page === 'authorization') {
      toShow = <AuthorizationPage destination={context.state.destination} controlState={context.controlState} language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme}/>
    }

    if (page === 'error') {
      toShow = <ErrorPage error={context.state.error} language={context.state.language} setUpLangAndTheme={context.setUpLangAndTheme} />
    }

    if (page === 'userpreferences') {
      toShow = <UserPreferencesPage controlState={context.controlState} language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme} />
    }

    if (page === 'work') {
      toShow = <WorkPage language={context.state.language} changeTheme={context.changeTheme} changeLanguage={context.changeLanguage} setUpLangAndTheme={context.setUpLangAndTheme}/>
    }

    return (
      <ThemeProvider theme={this.state.theme}>
        {toShow}
      </ThemeProvider>
    );
  }
}

export default Routes;
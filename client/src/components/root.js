import React from 'react';

import LandingPage from './landing_page';
import SigninPage from './signin_page';
import SignupPage from './signup_page';
import AuthorizationPage from './authorization_page';
import ErrorPage from './error_page';
import UserPreferencesPage from './user_pref_page';
import WorkPage from './work_page';
import EditPostPage from './editpost_page';
import ViewPostPage from './viewpost_page';

class Root extends React.Component {
  render() {
    const page = this.props.page;
    const context = this;

    if (page === 'landing') {
      return <LandingPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'signin') {
      return <SigninPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'signup') {
      return <SignupPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'authorization') {
      return <AuthorizationPage history={context.props.history} destination={context.props.destination} controlState={context.props.controlState} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'error') {
      return <ErrorPage history={context.props.history} error={context.props.error} language={context.props.language} />
    }

    if (page === 'userpreferences') {
      return <UserPreferencesPage history={context.props.history} controlState={context.props.controlState} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage} />
    }

    if (page === 'work') {
      return <WorkPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'editpost') {
      return <EditPostPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }

    if (page === 'viewpost') {
      return <ViewPostPage history={context.props.history} language={context.props.language} changeTheme={context.props.changeTheme} changeLanguage={context.props.changeLanguage}/>
    }
  }
}

export default Root;
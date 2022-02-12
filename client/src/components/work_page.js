import React from 'react';
import style from '../styles/work_page.module.css';
import { Footer, Menu } from '../utils/additional';
import { withTheme } from 'styled-components';
import languages from '../utils/languages';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSignOutError: false
    }
  }

  componentDidMount() {
    document.title = languages[this.props.language].general.page_titles.work;
  }

  hideSignOutError() {
    this.setState({
      showSignOutError: false
    })
  }

  render() {
    let logOutError;
    if (this.state.showSignOutError === true) {
      logOutError = (
        <div className={style.signout_error_box}>
          <p className={style.signout_error_text}>Something went wrong, please try again later <span onClick={() => { this.hideSignOutError() }} className={style.signout_error_X}>X</span></p>
        </div>
      )
    }

    return (
      <div>
        <Menu theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} />
        <div id='pageBody'>
          {logOutError}
          <p className={style.signin_text}>SUP | Work</p>
          <p className={style.signin_text}>{JSON.parse(localStorage.getItem('user')).name}</p>
          <button onClick={() => { this.signOut() }}>Sign out</button>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTheme(Page);
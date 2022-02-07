import React from 'react';
import styled from 'styled-components';
import style from '../styles/signup_page.module.css';
import logo from '../sup_logo.png';
import { withTheme } from 'styled-components';
import { Button, SelectContainer, StyledSelect, ArrowDown, StyledInput, checkEmail, checkPassword, sendRequest, ThemeSelector, LanguageSelector, Footer, StyledInputDiv, MessagePopUp } from './additional';
import languages from './languages';
require('dotenv').config();

const StyledP = styled.p`
  color: ${props => props.theme.textColor};

  font-size: 14pt;

  border-style: solid;
  border-radius: 10px;
  border-width: 0px;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.setMessage = this.setMessage.bind(this);

    this.state = {
      emailCheckResult: false,
      passwordCheckResult: false,
      showPasswordField: false,
      showLoadingCircle: false,
      showResponse: false
    }
  }

  componentDidMount() {
    document.title = languages[this.props.language].general.page_titles.signup;

    this.props.setUpLangAndTheme()
  }

  handleClick() {
    this.setState({
      emailCheckResult: false,
      passwordCheckResult: false,
      showPasswordField: false,
      showLoadingCircle: false,
      showResponse: false
    })

    const context = this;

    const email = document.getElementById('email').value;
    const emailCheck = checkEmail(email);

    if (emailCheck === true) {
      context.setState({
        showPasswordField: true
      })
    } else {
      context.setState({
        emailCheckResult: emailCheck,
        passwordCheckResult: true,
        showPasswordField: false
      })
    }
    
    try {
      const password = document.getElementById('password').value;
      const passwordCheck = checkPassword(password);

      if (passwordCheck !== true && emailCheck !== true) {
        context.setState({
          passwordCheckResult: true,
          showLoadingCircle: false
        })
      } else if (emailCheck !== true) {
        context.setState({
          passwordCheckResult: true,
          showLoadingCircle: false
        })
      } else if (passwordCheck !== true) {
        context.setState({
          passwordCheckResult: passwordCheck,
          showLoadingCircle: false
        })
      } else {
        context.setState({
          showLoadingCircle: true
        })

        const role = document.getElementById('emailSelect').value;

        const data = {data: JSON.stringify([email, password, role])};
  
        sendRequest('/signup', 'POST', data)
        .then((signupResult) => {
          if (signupResult === 'ok') {
            sendRequest('/signin', 'POST', data)
            .then((response) => {
              if (response.status === 'wrong' || response.status === 'error') {
                context.setState({
                  showLoadingCircle: false,
                  showResponse: languages[this.props.language].general.server_error_text
                })
              } else {
                localStorage.setItem('session', JSON.stringify(response.session));
                localStorage.setItem('user', JSON.stringify(response.user));
                window.location.href = '/userpreferences';
              }
            })
          }

          if (signupResult === 'error') {
            context.setState({
              showLoadingCircle: false,
              showResponse: languages[this.props.language].general.server_error_text
            })
          }

          if (signupResult === 'email_taken') {
            context.setState({
              emailCheckResult: 'email_taken',
              passwordCheckResult: true,
              showPasswordField: false,
              showLoadingCircle: false
            })
          }
        })
      }
    } catch(e) {
      context.setState({
        showLoadingCircle: false,
        showResponse: languages[this.props.language].general.server_error_text
      })
    }
  }

  setMessage(state) {
    this.setState({
      showResponse: state
    })
  }

  render() {
    let passwordField;
    if (this.state.showPasswordField === true) {
      passwordField = (
        <StyledInputDiv>
          <StyledInput className={style.password} id='password' type='password' placeholder='Password' required autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() } }}></StyledInput>
        </StyledInputDiv>
      )
    }

    let emailIncorrect;
    if (this.state.emailCheckResult !== true) {
      emailIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.email_error[this.state.emailCheckResult]}</p>
      )
    }

    let passwordIncorrect;
    if (this.state.passwordCheckResult !== true) {
      passwordIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.password_error[this.state.passwordCheckResult]}</p>
      )
    }

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <img src={this.props.theme.loadingCircle} alt='Loading...' className={style.loading_circle}></img>
      )
    }

    return (
      <div>
        <div className={style.container}>
          <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { window.location.href = '/' }}></img>
          <p className={style.signup_text}>{languages[this.props.language].signup_page.signup_text}</p>
          <StyledInputDiv>
            <StyledInput className={style.email} id='email' type='text' placeholder='Email' required autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() } }}></StyledInput>
            <span className={style.input_span}>
              <SelectContainer>
                <StyledSelect id='emailSelect' defaultValue='student'>
                  <option value='student'>@edu.sk.ru</option>
                  <option value='teacher'>@sk.ru</option>
                </StyledSelect>
                <ArrowDown className={style.arrowDown}  onClick={() => { document.getElementById('emailSelect').click() }} />
              </SelectContainer>
            </span>
          </StyledInputDiv>
          {emailIncorrect}
          {passwordField}
          {passwordIncorrect}
          {loadingCircle}
          <div className={style.bottom_div}>
            <StyledP onClick={() => { window.location.href = '/signin' }}>{languages[this.props.language].signup_page.signin_text}</StyledP>
            <Button id='next_btn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
          <div className={style.selectors_div}>
            <ThemeSelector changeTheme={this.props.changeTheme} language={this.props.language} style={style}></ThemeSelector>
            <LanguageSelector language={this.props.language} style={style} changeLanguage={this.props.changeLanguage}></LanguageSelector>
          </div>
        </div>
        <MessagePopUp showMessage={this.state.showResponse} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
        <Footer />
      </div>
    );
  }
}

export default withTheme(SignupForm);
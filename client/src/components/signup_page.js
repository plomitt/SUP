import React from 'react';
import styled from 'styled-components';
import style from '../styles/signup_page.module.css';
import logo from '../media/sup_logo.png';
import { withTheme } from 'styled-components';
import { Button, SelectContainer, StyledSelect, ArrowDown, StyledInput, checkEmail, checkPassword, sendRequest, ThemeSelector, LanguageSelector, Footer, StyledInputDiv, MessagePopUp } from '../utils/additional';
import languages from '../utils/languages';

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
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      responded: false,
      preventAutoHiding: false
    }
  }

  handleClick() {
    this.setState({
      emailCheckResult: false,
      passwordCheckResult: false,
      showPasswordField: false,
      showLoadingCircle: false
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
                  showLoadingCircle: false
                })
                context.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
              } else {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('authorized', 'true');
                this.props.history.push('/userpreferences?tab=profile');
              }
            })
          }

          if (signupResult === 'error') {
            context.setState({
              showLoadingCircle: false
            })
            context.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
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
        showLoadingCircle: false
      })
      context.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
    }
  }

  setMessage(body, msgType, title, titleType,) {
    this.setState({
      showMessage: body,
      messageType: msgType,
      messageTitle: title,
      titleType: titleType,
      preventAutoHiding: arguments[arguments.length - 1],
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
        <div id='page'>
          <div className={style.container}>
            <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { this.props.history.push('/') }}></img>
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
              <StyledP onClick={() => { this.props.history.push('/signin') }}>{languages[this.props.language].signup_page.signin_text}</StyledP>
              <Button id='next_btn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
            </div>
            <div className={style.selectors_div}>
              <ThemeSelector changeTheme={this.props.changeTheme} language={this.props.language} style={style}></ThemeSelector>
              <LanguageSelector language={this.props.language} style={style} changeLanguage={this.props.changeLanguage}></LanguageSelector>
            </div>
          </div>
          <Footer />
        </div>
        <MessagePopUp elementId={'page'} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    );
  }
}

export default withTheme(SignupForm);
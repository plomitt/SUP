import React from 'react';
import styled from 'styled-components';
import style from '../styles/signin_page.module.css';
import logo from '../media/sup_logo.png';
import { withTheme } from 'styled-components';
import { Button, StyledInput, SelectContainer, StyledSelect, ArrowDown, sendRequest, ThemeSelector, LanguageSelector, Footer, StyledInputDiv, getEmptyUserProfileFields } from '../utils/additional';
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

class SigninForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      emailEmpty: false,
      passwordEmpty: false,
      showPasswordField: false,
      showLoadingCircle: false,
      showResponse: false
    }
  }

  handleClick() {
    this.setState({
      emailEmpty: false,
      passwordEmpty: false,
      showPasswordField: false,
      showLoadingCircle: false,
      showResponse: false
    })

    const context = this;

    const email = document.getElementById('email').value;

    if (email === '') {
      context.setState({
        emailEmpty: true,
        passwordEmpty: false,
        showPasswordField: false
      })
    } else {
      context.setState({
        showPasswordField: true,
      })
    }
    
    try {
      const password = document.getElementById('password').value;

      if (password === '' && email === '') {
        context.setState({
          passwordEmpty: false,
          showLoadingCircle: false
        })
      } else if (email === '') {
        context.setState({
          passwordEmpty: false,
          showLoadingCircle: false
        })
      } else if (password === '') {
        context.setState({
          passwordEmpty: true,
          showLoadingCircle: false
        })
      } else {
        context.setState({
          showLoadingCircle: true
        })

        const role = document.getElementById('emailSelect').value;

        sendRequest('/signin', 'POST', {data: JSON.stringify([email, password, role])})
        .then((response) => {
          const status = response.status;
          
          if (status === 'ok') {
            localStorage.setItem('user', JSON.stringify(response.user));

            const fields = getEmptyUserProfileFields();

            if (fields.length !== 0) {
              const path = '/userpreferences?tab=profile&showpopup=true'
              localStorage.setItem('authorized', 'true');

              this.props.history.push(path);
            } else {
              this.props.history.push('/work')
            }

          }

          if (status === 'wrong') {
            context.setState({
              showLoadingCircle: false,
              showResponse: 'wrong_combination_text'
            })
          }

          if (status === 'error') {
            context.setState({
              showLoadingCircle: false,
              showResponse: 'server_error_text'
            })
          }
        })
      }
    } catch(e) {}
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

    let emailEmpty;
    if (this.state.emailEmpty === true) {
      emailEmpty = (
        <p className={style.typing_error}>{languages[this.props.language].signin_page.filloutfield_text}</p>
      )
    }

    let passwordEmpty;
    if (this.state.passwordEmpty === true) {
      passwordEmpty = (
        <p className={style.typing_error}>{languages[this.props.language].signin_page.filloutfield_text}</p>
      )
    }

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <img src={this.props.theme.loadingCircle} alt='Loading...' className={style.loading_circle}></img>
      )
    }

    let response;
    if (this.state.showResponse !== false) {
      loadingCircle = (
        <p className={style.typing_error}>{languages[this.props.language].signin_page[this.state.showResponse]}</p>
      )
    }

    return (
      <div>
        <div className={style.container}>
          <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { this.props.history.push('/') }}></img>
          <p className={style.signin_text}>{languages[this.props.language].signin_page.signin_text}</p>
          <StyledInputDiv>
            <StyledInput className={style.email} id='email' type='text' placeholder='Email' required autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() } }}></StyledInput>
            <div className={style.input_span}>
              <SelectContainer>
                <StyledSelect id='emailSelect' defaultValue='student'>
                  <option value='student'>@edu.sk.ru</option>
                  <option value='teacher'>@sk.ru</option>
                </StyledSelect>
                <ArrowDown className={style.arrowDown}  onClick={() => { document.getElementById('emailSelect').click() }} />
              </SelectContainer>
            </div>
          </StyledInputDiv>
          {emailEmpty}
          {passwordField}
          {passwordEmpty}
          {response}
          {loadingCircle}
          <div className={style.bottom_div}>
            <StyledP onClick={() => { this.props.history.push('/signup') }}>{languages[this.props.language].signin_page.create_account_text}</StyledP>
            <Button id='next_btn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signin_page.next_btn}</Button>
          </div>
          <div className={style.selectors_div}>
            <ThemeSelector changeTheme={this.props.changeTheme} language={this.props.language} style={style}></ThemeSelector>
            <LanguageSelector language={this.props.language} style={style} changeLanguage={this.props.changeLanguage}></LanguageSelector>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTheme(SigninForm);
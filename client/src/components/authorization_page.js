import React from 'react';
import style from '../styles/signin_page.module.css';
import logo from '../media/sup_logo.png';
import styled, { withTheme } from 'styled-components';
import { Button, StyledInput, sendRequest, ThemeSelector, LanguageSelector, Footer, StyledInputDiv, signOut } from '../utils/additional';
import languages from '../utils/languages';


const Container = styled.div`
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.borderColor};
`

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      passwordEmpty: false,
      showLoadingCircle: false,
      showResponse: false
    }
  }

  handleClick() {
    this.setState({
      passwordEmpty: false,
      showLoadingCircle: false,
      showResponse: false
    })

    const context = this;
    
    const password = document.getElementById('password').value;

    if (password === '') {
      context.setState({
        passwordEmpty: true,
        showLoadingCircle: false
      })
    } else {
      context.setState({
        showLoadingCircle: true
      })

      sendRequest('/authorization', 'POST', {data: JSON.stringify([password])})
      .then((response) => {        
        if (response === 'ok') {
          localStorage.setItem('authorized', 'true');
          this.props.history.push(context.props.destination);
        }

        if (response === 'wrong') {
          context.setState({
            showLoadingCircle: false,
            showResponse: 'wrong_password'
          })
        }

        if (response === 'error' || response === 'banned') {
          signOut();
          this.props.history.push('/');
        }
      })
    }
  }

  render() {
    const passwordField = (
      <StyledInputDiv>
        <StyledInput className={style.password} id='password' type='password' placeholder='Password' required autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() } }}></StyledInput>
      </StyledInputDiv>
    )

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
        <p className={style.typing_error}>{languages[this.props.language].authorization_page[this.state.showResponse]}</p>
      )
    }

    return (
      <div>
        <Container className={style.container}>
          <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { this.props.history.push('/') }}></img>
          <p className={style.signin_text}>{languages[this.props.language].signin_page.auth_text}</p>
          {passwordField}
          {passwordEmpty}
          {response}
          {loadingCircle}
          <div className={style.bottom_div_auth}>
            <Button id='next_btn' className={style.next_btn_auth} onClick={() => {this.handleClick()}}>{languages[this.props.language].signin_page.next_btn}</Button>
          </div>
          <div className={style.selectors_div}>
            <ThemeSelector changeTheme={this.props.changeTheme} language={this.props.language} style={style}></ThemeSelector>
            <LanguageSelector language={this.props.language} style={style} changeLanguage={this.props.changeLanguage}></LanguageSelector>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default withTheme(AuthPage);